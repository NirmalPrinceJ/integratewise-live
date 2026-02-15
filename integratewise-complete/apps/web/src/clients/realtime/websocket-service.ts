// src/services/realtime/websocket-service.ts
// Real-time WebSocket Service for Live Updates and Collaboration

import { WebSocket } from 'ws';
import { IncomingMessage } from 'http';

interface Client {
  id: string;
  ws: WebSocket;
  userId: string;
  context: {
    category: 'personal' | 'csm' | 'business';
    scope: any;
  };
  subscriptions: string[];
}

interface RealtimeMessage {
  type: 'update' | 'notification' | 'collaboration' | 'agent_action';
  channel: string;
  payload: any;
  timestamp: number;
  userId?: string;
}

export class WebSocketService {
  private clients: Map<string, Client> = new Map();
  private channels: Map<string, Set<string>> = new Map(); // channel -> clientIds

  handleConnection(ws: WebSocket, request: IncomingMessage, userId: string, context: any) {
    const clientId = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const client: Client = {
      id: clientId,
      ws,
      userId,
      context,
      subscriptions: []
    };

    this.clients.set(clientId, client);

    ws.on('message', (data: Buffer) => {
      try {
        const message: RealtimeMessage = JSON.parse(data.toString());
        this.handleMessage(client, message);
      } catch (error) {
        console.error('Invalid message format:', error);
      }
    });

    ws.on('close', () => {
      this.handleDisconnection(clientId);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      this.handleDisconnection(clientId);
    });

    // Send welcome message
    this.sendToClient(clientId, {
      type: 'notification',
      channel: 'system',
      payload: { message: 'Connected to IntegrateWise OS real-time service' },
      timestamp: Date.now()
    });
  }

  private handleMessage(client: Client, message: RealtimeMessage) {
    switch (message.type) {
      case 'subscribe':
        this.subscribeToChannel(client.id, message.channel);
        break;
      case 'unsubscribe':
        this.unsubscribeFromChannel(client.id, message.channel);
        break;
      case 'update':
        this.broadcastToChannel(message.channel, message, client.id);
        break;
      case 'collaboration':
        this.handleCollaboration(client, message);
        break;
    }
  }

  private subscribeToChannel(clientId: string, channel: string) {
    const client = this.clients.get(clientId);
    if (!client) return;

    if (!client.subscriptions.includes(channel)) {
      client.subscriptions.push(channel);
    }

    if (!this.channels.has(channel)) {
      this.channels.set(channel, new Set());
    }
    this.channels.get(channel)!.add(clientId);
  }

  private unsubscribeFromChannel(clientId: string, channel: string) {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.subscriptions = client.subscriptions.filter(sub => sub !== channel);

    const channelClients = this.channels.get(channel);
    if (channelClients) {
      channelClients.delete(clientId);
      if (channelClients.size === 0) {
        this.channels.delete(channel);
      }
    }
  }

  private broadcastToChannel(channel: string, message: RealtimeMessage, excludeClientId?: string) {
    const channelClients = this.channels.get(channel);
    if (!channelClients) return;

    const broadcastMessage = {
      ...message,
      timestamp: Date.now()
    };

    for (const clientId of channelClients) {
      if (clientId !== excludeClientId) {
        this.sendToClient(clientId, broadcastMessage);
      }
    }
  }

  private handleCollaboration(client: Client, message: RealtimeMessage) {
    // Handle collaborative editing, cursor positions, etc.
    const collaborationMessage = {
      ...message,
      userId: client.userId,
      timestamp: Date.now()
    };

    this.broadcastToChannel(message.channel, collaborationMessage, client.id);
  }

  private handleDisconnection(clientId: string) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Unsubscribe from all channels
    for (const channel of client.subscriptions) {
      this.unsubscribeFromChannel(clientId, channel);
    }

    this.clients.delete(clientId);
  }

  // Public methods for sending updates from other services
  broadcastUpdate(channel: string, payload: any, userId?: string) {
    this.broadcastToChannel(channel, {
      type: 'update',
      channel,
      payload,
      timestamp: Date.now(),
      userId
    });
  }

  sendNotification(userId: string, payload: any) {
    // Find all clients for this user and send notification
    for (const [clientId, client] of this.clients) {
      if (client.userId === userId) {
        this.sendToClient(clientId, {
          type: 'notification',
          channel: 'user',
          payload,
          timestamp: Date.now()
        });
      }
    }
  }

  notifyAgentAction(action: string, context: any) {
    // Broadcast agent actions to relevant channels
    const channel = `agent-${context.category}`;
    this.broadcastToChannel(channel, {
      type: 'agent_action',
      channel,
      payload: { action, context },
      timestamp: Date.now()
    });
  }

  private sendToClient(clientId: string, message: RealtimeMessage) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  // Get connection stats
  getStats() {
    return {
      totalClients: this.clients.size,
      activeChannels: this.channels.size,
      channelSubscriptions: Object.fromEntries(
        Array.from(this.channels.entries()).map(([channel, clients]) => [channel, clients.size])
      )
    };
  }
}

// Singleton instance
export const websocketService = new WebSocketService();