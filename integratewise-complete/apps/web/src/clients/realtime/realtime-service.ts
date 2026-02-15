// src/services/realtime/realtime-service.ts
// Real-time collaboration service using WebSockets

interface RealtimeEvent {
  type: 'update' | 'notification' | 'cursor' | 'presence';
  userId: string;
  data: any;
  timestamp: number;
  room: string; // e.g., 'task-123', 'dashboard-business'
}

interface PresenceUser {
  id: string;
  name: string;
  avatar?: string;
  cursor?: { x: number; y: number };
  lastSeen: number;
}

export class RealtimeService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private eventListeners: Map<string, ((event: RealtimeEvent) => void)[]> = new Map();
  private presenceUsers: Map<string, PresenceUser[]> = new Map(); // room -> users

  constructor(private wsUrl: string) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.wsUrl);

        this.ws.onopen = () => {
          console.log('Real-time connection established');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const realtimeEvent: RealtimeEvent = JSON.parse(event.data);
            this.handleEvent(realtimeEvent);
          } catch (error) {
            console.error('Failed to parse real-time event:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('Real-time connection closed');
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('Real-time connection error:', error);
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  sendEvent(event: Omit<RealtimeEvent, 'timestamp'>) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const fullEvent: RealtimeEvent = {
        ...event,
        timestamp: Date.now()
      };
      this.ws.send(JSON.stringify(fullEvent));
    } else {
      console.warn('WebSocket not connected, event not sent:', event);
    }
  }

  joinRoom(room: string, user: PresenceUser) {
    this.sendEvent({
      type: 'presence',
      userId: user.id,
      data: { action: 'join', user },
      room
    });
  }

  leaveRoom(room: string, userId: string) {
    this.sendEvent({
      type: 'presence',
      userId,
      data: { action: 'leave', userId },
      room
    });
  }

  updateCursor(room: string, userId: string, cursor: { x: number; y: number }) {
    this.sendEvent({
      type: 'cursor',
      userId,
      data: { cursor },
      room
    });
  }

  sendNotification(room: string, userId: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
    this.sendEvent({
      type: 'notification',
      userId,
      data: { message, type },
      room
    });
  }

  sendUpdate(room: string, userId: string, data: any) {
    this.sendEvent({
      type: 'update',
      userId,
      data,
      room
    });
  }

  on(eventType: string, callback: (event: RealtimeEvent) => void) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }

  off(eventType: string, callback: (event: RealtimeEvent) => void) {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private handleEvent(event: RealtimeEvent) {
    // Update presence
    if (event.type === 'presence') {
      this.updatePresence(event.room, event.data);
    }

    // Notify listeners
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(callback => callback(event));
    }

    // Notify all listeners
    const allListeners = this.eventListeners.get('*');
    if (allListeners) {
      allListeners.forEach(callback => callback(event));
    }
  }

  private updatePresence(room: string, data: any) {
    if (!this.presenceUsers.has(room)) {
      this.presenceUsers.set(room, []);
    }

    const users = this.presenceUsers.get(room)!;

    if (data.action === 'join') {
      // Add or update user
      const existingIndex = users.findIndex(u => u.id === data.user.id);
      if (existingIndex > -1) {
        users[existingIndex] = { ...data.user, lastSeen: Date.now() };
      } else {
        users.push({ ...data.user, lastSeen: Date.now() });
      }
    } else if (data.action === 'leave') {
      // Remove user
      const index = users.findIndex(u => u.id === data.userId);
      if (index > -1) {
        users.splice(index, 1);
      }
    }

    // Clean up inactive users (not seen for 5 minutes)
    const now = Date.now();
    this.presenceUsers.set(room, users.filter(u => now - u.lastSeen < 300000));
  }

  getPresence(room: string): PresenceUser[] {
    return this.presenceUsers.get(room) || [];
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// React hook for using real-time service
export function useRealtime(room: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [presence, setPresence] = useState<PresenceUser[]>([]);
  const realtimeRef = useRef<RealtimeService | null>(null);

  useEffect(() => {
    const initRealtime = async () => {
      if (!realtimeRef.current) {
        realtimeRef.current = new RealtimeService(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080');
      }

      try {
        await realtimeRef.current.connect();
        setIsConnected(true);

        // Join room
        realtimeRef.current.joinRoom(room, {
          id: 'current-user', // Replace with actual user ID
          name: 'Current User', // Replace with actual user name
          lastSeen: Date.now()
        });

        // Listen for presence updates
        realtimeRef.current.on('presence', () => {
          setPresence(realtimeRef.current!.getPresence(room));
        });

        // Listen for all events
        realtimeRef.current.on('*', (event) => {
          console.log('Real-time event:', event);
        });

      } catch (error) {
        console.error('Failed to connect to real-time service:', error);
      }
    };

    initRealtime();

    return () => {
      if (realtimeRef.current) {
        realtimeRef.current.leaveRoom(room, 'current-user');
        realtimeRef.current.disconnect();
      }
    };
  }, [room]);

  const sendUpdate = useCallback((data: any) => {
    if (realtimeRef.current) {
      realtimeRef.current.sendUpdate(room, 'current-user', data);
    }
  }, [room]);

  const sendNotification = useCallback((message: string, type?: 'info' | 'success' | 'warning' | 'error') => {
    if (realtimeRef.current) {
      realtimeRef.current.sendNotification(room, 'current-user', message, type);
    }
  }, [room]);

  const updateCursor = useCallback((cursor: { x: number; y: number }) => {
    if (realtimeRef.current) {
      realtimeRef.current.updateCursor(room, 'current-user', cursor);
    }
  }, [room]);

  return {
    isConnected,
    presence,
    sendUpdate,
    sendNotification,
    updateCursor
  };
}