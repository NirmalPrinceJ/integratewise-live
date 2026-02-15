/**
 * IntegrateWise OS - Stream Gateway
 * 
 * Real-time WebSocket/SSE service using Cloudflare Durable Objects.
 * 
 * Durable Objects:
 * - SignalStreamDO: Tenant-scoped signal broadcasting
 * - PresenceDO: User presence tracking per room
 * - RoomDO: Collaboration rooms (tasks, accounts, dashboards)
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { DurableObject } from 'cloudflare:workers';

// =============================================================================
// TYPES
// =============================================================================

interface Env {
  SIGNAL_STREAM: DurableObjectNamespace;
  PRESENCE: DurableObjectNamespace;
  ROOM: DurableObjectNamespace;
  CONNECTION_META: KVNamespace;
  RATE_LIMIT: KVNamespace;
  THINK: Fetcher;
  TENANTS: Fetcher;
  IQ_HUB: Fetcher;
  ENVIRONMENT: string;
  MAX_CONNECTIONS_PER_TENANT: string;
  MAX_CONNECTIONS_PER_USER: string;
  HEARTBEAT_INTERVAL_MS: string;
  CONNECTION_TIMEOUT_MS: string;
}

interface Signal {
  id: string;
  type: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description?: string;
  entity_type?: string;
  entity_id?: string;
  account_id?: string;
  data?: Record<string, unknown>;
  created_at: string;
}

interface PresenceUser {
  user_id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy';
  cursor?: { x: number; y: number };
  last_seen: number;
}

interface StreamMessage {
  type: 'signal' | 'presence' | 'update' | 'notification' | 'cursor' | 'typing';
  channel: string;
  payload: unknown;
  sender_id?: string;
  timestamp: number;
}

// =============================================================================
// DURABLE OBJECT: Signal Stream
// =============================================================================

export class SignalStreamDO extends DurableObject {
  private sessions: Map<WebSocket, { tenantId: string; userId: string; channels: Set<string> }> = new Map();
  private recentSignals: Signal[] = [];
  private readonly MAX_RECENT_SIGNALS = 100;

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    // Load recent signals from storage on startup
    this.state.blockConcurrencyWhile(async () => {
      const stored = await this.state.storage.get<Signal[]>('recentSignals');
      if (stored) this.recentSignals = stored;
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // WebSocket upgrade
    if (request.headers.get('Upgrade') === 'websocket') {
      return this.handleWebSocket(request);
    }

    // HTTP endpoints
    switch (url.pathname) {
      case '/broadcast':
        if (request.method === 'POST') {
          return this.handleBroadcast(request);
        }
        break;
      case '/stats':
        return this.handleStats();
      case '/recent':
        return Response.json({ signals: this.recentSignals });
    }

    return new Response('Not Found', { status: 404 });
  }

  private async handleWebSocket(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const tenantId = url.searchParams.get('tenantId');
    const userId = url.searchParams.get('userId');
    const channels = url.searchParams.get('channels')?.split(',') || ['default'];

    if (!tenantId || !userId) {
      return new Response('Missing tenantId or userId', { status: 400 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    // Accept the WebSocket with hibernation support
    this.state.acceptWebSocket(server);

    // Store session metadata
    this.sessions.set(server, {
      tenantId,
      userId,
      channels: new Set(channels),
    });

    // Send initial state
    server.send(JSON.stringify({
      type: 'init',
      payload: {
        connected: true,
        channels,
        recent_signals: this.recentSignals.filter(s => 
          channels.includes('all') || channels.includes(s.type)
        ).slice(0, 20),
      },
      timestamp: Date.now(),
    }));

    return new Response(null, { status: 101, webSocket: client });
  }

  // Hibernation API handlers
  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    try {
      const data = JSON.parse(message as string) as StreamMessage;
      const session = this.sessions.get(ws);

      if (!session) return;

      switch (data.type) {
        case 'subscribe':
          if (typeof data.channel === 'string') {
            session.channels.add(data.channel);
          }
          break;
        case 'unsubscribe':
          if (typeof data.channel === 'string') {
            session.channels.delete(data.channel);
          }
          break;
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          break;
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  }

  async webSocketClose(ws: WebSocket, code: number, reason: string): Promise<void> {
    this.sessions.delete(ws);
  }

  async webSocketError(ws: WebSocket, error: unknown): Promise<void> {
    console.error('WebSocket error:', error);
    this.sessions.delete(ws);
  }

  private async handleBroadcast(request: Request): Promise<Response> {
    const signal = await request.json() as Signal;
    const tenantId = request.headers.get('x-tenant-id');

    if (!tenantId) {
      return new Response('Missing x-tenant-id header', { status: 400 });
    }

    // Store in recent signals
    this.recentSignals.unshift(signal);
    if (this.recentSignals.length > this.MAX_RECENT_SIGNALS) {
      this.recentSignals.pop();
    }
    await this.state.storage.put('recentSignals', this.recentSignals);

    // Broadcast to matching sessions
    let delivered = 0;
    for (const [ws, session] of this.sessions) {
      if (session.tenantId === tenantId) {
        try {
          ws.send(JSON.stringify({
            type: 'signal',
            channel: signal.type,
            payload: signal,
            timestamp: Date.now(),
          }));
          delivered++;
        } catch (error) {
          // Connection dead, will be cleaned up
          this.sessions.delete(ws);
        }
      }
    }

    return Response.json({ status: 'broadcast', delivered, total_connections: this.sessions.size });
  }

  private handleStats(): Response {
    const tenantCounts: Record<string, number> = {};
    for (const [, session] of this.sessions) {
      tenantCounts[session.tenantId] = (tenantCounts[session.tenantId] || 0) + 1;
    }

    return Response.json({
      total_connections: this.sessions.size,
      by_tenant: tenantCounts,
      recent_signals_count: this.recentSignals.length,
    });
  }
}

// =============================================================================
// DURABLE OBJECT: Presence
// =============================================================================

export class PresenceDO extends DurableObject {
  private users: Map<string, PresenceUser> = new Map();
  private sockets: Map<WebSocket, string> = new Map(); // ws -> userId

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.headers.get('Upgrade') === 'websocket') {
      return this.handleWebSocket(request);
    }

    switch (url.pathname) {
      case '/users':
        return Response.json({ users: Array.from(this.users.values()) });
      case '/join':
        if (request.method === 'POST') {
          const user = await request.json() as PresenceUser;
          this.users.set(user.user_id, { ...user, last_seen: Date.now() });
          this.broadcastPresence('join', user);
          return Response.json({ status: 'joined' });
        }
        break;
      case '/leave':
        if (request.method === 'POST') {
          const { user_id } = await request.json() as { user_id: string };
          const user = this.users.get(user_id);
          if (user) {
            this.users.delete(user_id);
            this.broadcastPresence('leave', user);
          }
          return Response.json({ status: 'left' });
        }
        break;
    }

    return new Response('Not Found', { status: 404 });
  }

  private async handleWebSocket(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const userName = url.searchParams.get('userName') || 'Anonymous';

    if (!userId) {
      return new Response('Missing userId', { status: 400 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    this.state.acceptWebSocket(server);
    this.sockets.set(server, userId);

    // Add user to presence
    const user: PresenceUser = {
      user_id: userId,
      name: userName,
      status: 'online',
      last_seen: Date.now(),
    };
    this.users.set(userId, user);

    // Send current users
    server.send(JSON.stringify({
      type: 'presence_init',
      payload: { users: Array.from(this.users.values()) },
      timestamp: Date.now(),
    }));

    // Broadcast join
    this.broadcastPresence('join', user, server);

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    try {
      const data = JSON.parse(message as string);
      const userId = this.sockets.get(ws);
      if (!userId) return;

      const user = this.users.get(userId);
      if (!user) return;

      switch (data.type) {
        case 'cursor':
          user.cursor = data.payload;
          user.last_seen = Date.now();
          this.broadcastPresence('cursor', user, ws);
          break;
        case 'status':
          user.status = data.payload.status;
          user.last_seen = Date.now();
          this.broadcastPresence('status', user, ws);
          break;
        case 'heartbeat':
          user.last_seen = Date.now();
          break;
      }
    } catch (error) {
      console.error('Presence message error:', error);
    }
  }

  async webSocketClose(ws: WebSocket): Promise<void> {
    const userId = this.sockets.get(ws);
    if (userId) {
      const user = this.users.get(userId);
      if (user) {
        this.users.delete(userId);
        this.broadcastPresence('leave', user);
      }
      this.sockets.delete(ws);
    }
  }

  async webSocketError(ws: WebSocket, error: unknown): Promise<void> {
    console.error('Presence WebSocket error:', error);
    this.webSocketClose(ws);
  }

  private broadcastPresence(event: string, user: PresenceUser, exclude?: WebSocket): void {
    const message = JSON.stringify({
      type: `presence_${event}`,
      payload: user,
      timestamp: Date.now(),
    });

    for (const [ws] of this.sockets) {
      if (ws !== exclude) {
        try {
          ws.send(message);
        } catch {
          this.sockets.delete(ws);
        }
      }
    }
  }
}

// =============================================================================
// DURABLE OBJECT: Room (Collaboration)
// =============================================================================

export class RoomDO extends DurableObject {
  private participants: Map<WebSocket, { userId: string; name: string }> = new Map();
  private roomState: Record<string, unknown> = {};

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    this.state.blockConcurrencyWhile(async () => {
      const stored = await this.state.storage.get<Record<string, unknown>>('roomState');
      if (stored) this.roomState = stored;
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.headers.get('Upgrade') === 'websocket') {
      return this.handleWebSocket(request);
    }

    switch (url.pathname) {
      case '/state':
        return Response.json({ state: this.roomState, participants: this.participants.size });
      case '/update':
        if (request.method === 'POST') {
          const update = await request.json() as { key: string; value: unknown };
          this.roomState[update.key] = update.value;
          await this.state.storage.put('roomState', this.roomState);
          this.broadcastUpdate(update);
          return Response.json({ status: 'updated' });
        }
        break;
    }

    return new Response('Not Found', { status: 404 });
  }

  private async handleWebSocket(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const userName = url.searchParams.get('userName') || 'Anonymous';

    if (!userId) {
      return new Response('Missing userId', { status: 400 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    this.state.acceptWebSocket(server);
    this.participants.set(server, { userId, name: userName });

    // Send current state
    server.send(JSON.stringify({
      type: 'room_init',
      payload: {
        state: this.roomState,
        participants: Array.from(this.participants.values()),
      },
      timestamp: Date.now(),
    }));

    // Broadcast join
    this.broadcastToAll({
      type: 'participant_join',
      payload: { userId, name: userName },
      timestamp: Date.now(),
    }, server);

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    try {
      const data = JSON.parse(message as string);
      const participant = this.participants.get(ws);
      if (!participant) return;

      switch (data.type) {
        case 'update':
          this.roomState[data.key] = data.value;
          await this.state.storage.put('roomState', this.roomState);
          this.broadcastUpdate({ key: data.key, value: data.value, sender: participant.userId }, ws);
          break;
        case 'cursor':
          this.broadcastToAll({
            type: 'cursor',
            payload: { userId: participant.userId, cursor: data.cursor },
            timestamp: Date.now(),
          }, ws);
          break;
        case 'typing':
          this.broadcastToAll({
            type: 'typing',
            payload: { userId: participant.userId, field: data.field },
            timestamp: Date.now(),
          }, ws);
          break;
      }
    } catch (error) {
      console.error('Room message error:', error);
    }
  }

  async webSocketClose(ws: WebSocket): Promise<void> {
    const participant = this.participants.get(ws);
    if (participant) {
      this.participants.delete(ws);
      this.broadcastToAll({
        type: 'participant_leave',
        payload: participant,
        timestamp: Date.now(),
      });
    }
  }

  async webSocketError(ws: WebSocket, error: unknown): Promise<void> {
    console.error('Room WebSocket error:', error);
    this.webSocketClose(ws);
  }

  private broadcastUpdate(update: { key: string; value: unknown; sender?: string }, exclude?: WebSocket): void {
    const message = JSON.stringify({
      type: 'state_update',
      payload: update,
      timestamp: Date.now(),
    });

    for (const [ws] of this.participants) {
      if (ws !== exclude) {
        try {
          ws.send(message);
        } catch {
          this.participants.delete(ws);
        }
      }
    }
  }

  private broadcastToAll(message: object, exclude?: WebSocket): void {
    const json = JSON.stringify(message);
    for (const [ws] of this.participants) {
      if (ws !== exclude) {
        try {
          ws.send(json);
        } catch {
          this.participants.delete(ws);
        }
      }
    }
  }
}

// =============================================================================
// HONO APP - HTTP API
// =============================================================================

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

// Health check
app.get('/', (c) => {
  return c.json({
    status: 'ok',
    service: 'integratewise-stream-gateway',
    description: 'Real-time WebSocket/SSE service using Durable Objects',
    endpoints: {
      websocket: '/ws/signals?tenantId=...&userId=...',
      sse: '/sse/signals?tenantId=...',
      presence: '/ws/presence/:roomId?userId=...',
      room: '/ws/room/:roomId?userId=...',
    },
  });
});

app.get('/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// =============================================================================
// WEBSOCKET ENDPOINTS
// =============================================================================

/**
 * WebSocket endpoint for signal streaming
 */
app.get('/ws/signals', async (c) => {
  const tenantId = c.req.query('tenantId');
  
  if (!tenantId) {
    return c.json({ error: 'Missing tenantId' }, 400);
  }

  // Rate limiting check
  const rateLimitKey = `ws:${tenantId}:count`;
  const currentCount = parseInt(await c.env.RATE_LIMIT.get(rateLimitKey) || '0');
  const maxConnections = parseInt(c.env.MAX_CONNECTIONS_PER_TENANT);

  if (currentCount >= maxConnections) {
    return c.json({ error: 'Too many connections for tenant' }, 429);
  }

  // Route to tenant-specific Durable Object
  const id = c.env.SIGNAL_STREAM.idFromName(tenantId);
  const stub = c.env.SIGNAL_STREAM.get(id);

  // Increment connection count
  await c.env.RATE_LIMIT.put(rateLimitKey, String(currentCount + 1), { expirationTtl: 3600 });

  return stub.fetch(c.req.raw);
});

/**
 * WebSocket endpoint for presence tracking
 */
app.get('/ws/presence/:roomId', async (c) => {
  const roomId = c.req.param('roomId');
  const tenantId = c.req.query('tenantId');

  if (!tenantId) {
    return c.json({ error: 'Missing tenantId' }, 400);
  }

  const id = c.env.PRESENCE.idFromName(`${tenantId}:${roomId}`);
  const stub = c.env.PRESENCE.get(id);

  return stub.fetch(c.req.raw);
});

/**
 * WebSocket endpoint for collaboration rooms
 */
app.get('/ws/room/:roomId', async (c) => {
  const roomId = c.req.param('roomId');
  const tenantId = c.req.query('tenantId');

  if (!tenantId) {
    return c.json({ error: 'Missing tenantId' }, 400);
  }

  const id = c.env.ROOM.idFromName(`${tenantId}:${roomId}`);
  const stub = c.env.ROOM.get(id);

  return stub.fetch(c.req.raw);
});

// =============================================================================
// SSE ENDPOINT (Fallback for environments without WebSocket)
// =============================================================================

app.get('/sse/signals', async (c) => {
  const tenantId = c.req.query('tenantId');
  const userId = c.req.query('userId');

  if (!tenantId || !userId) {
    return c.json({ error: 'Missing tenantId or userId' }, 400);
  }

  // Get recent signals from Durable Object
  const id = c.env.SIGNAL_STREAM.idFromName(tenantId);
  const stub = c.env.SIGNAL_STREAM.get(id);
  
  const recentResponse = await stub.fetch(new Request('http://internal/recent'));
  const { signals } = await recentResponse.json() as { signals: Signal[] };

  // Create SSE stream
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Send initial signals
  (async () => {
    try {
      // Send recent signals
      for (const signal of signals.slice(0, 10)) {
        await writer.write(encoder.encode(`data: ${JSON.stringify(signal)}\n\n`));
      }

      // Send heartbeat every 30 seconds
      const heartbeatInterval = setInterval(async () => {
        try {
          await writer.write(encoder.encode(`: heartbeat\n\n`));
        } catch {
          clearInterval(heartbeatInterval);
        }
      }, 30000);

      // Keep connection alive for up to 5 minutes, then let client reconnect
      setTimeout(() => {
        clearInterval(heartbeatInterval);
        writer.close();
      }, 300000);

    } catch (error) {
      console.error('SSE error:', error);
      writer.close();
    }
  })();

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
});

// =============================================================================
// HTTP API FOR BROADCASTING
// =============================================================================

/**
 * POST /broadcast - Broadcast a signal to all connected clients
 */
app.post('/broadcast', async (c) => {
  const tenantId = c.req.header('x-tenant-id');

  if (!tenantId) {
    return c.json({ error: 'Missing x-tenant-id header' }, 400);
  }

  const signal = await c.req.json() as Signal;

  // Route to tenant's Signal Stream DO
  const id = c.env.SIGNAL_STREAM.idFromName(tenantId);
  const stub = c.env.SIGNAL_STREAM.get(id);

  const response = await stub.fetch(new Request('http://internal/broadcast', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-tenant-id': tenantId,
    },
    body: JSON.stringify(signal),
  }));

  return response;
});

/**
 * GET /stats - Get connection statistics
 */
app.get('/stats', async (c) => {
  const tenantId = c.req.query('tenantId');

  if (!tenantId) {
    return c.json({ error: 'Missing tenantId' }, 400);
  }

  const id = c.env.SIGNAL_STREAM.idFromName(tenantId);
  const stub = c.env.SIGNAL_STREAM.get(id);

  const response = await stub.fetch(new Request('http://internal/stats'));
  return response;
});

/**
 * GET /presence/:roomId - Get users in a room
 */
app.get('/presence/:roomId', async (c) => {
  const roomId = c.req.param('roomId');
  const tenantId = c.req.query('tenantId');

  if (!tenantId) {
    return c.json({ error: 'Missing tenantId' }, 400);
  }

  const id = c.env.PRESENCE.idFromName(`${tenantId}:${roomId}`);
  const stub = c.env.PRESENCE.get(id);

  const response = await stub.fetch(new Request('http://internal/users'));
  return response;
});

/**
 * GET /room/:roomId/state - Get room state
 */
app.get('/room/:roomId/state', async (c) => {
  const roomId = c.req.param('roomId');
  const tenantId = c.req.query('tenantId');

  if (!tenantId) {
    return c.json({ error: 'Missing tenantId' }, 400);
  }

  const id = c.env.ROOM.idFromName(`${tenantId}:${roomId}`);
  const stub = c.env.ROOM.get(id);

  const response = await stub.fetch(new Request('http://internal/state'));
  return response;
});

// =============================================================================
// EXPORT
// =============================================================================

export default app;
