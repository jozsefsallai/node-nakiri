import WebSocket from 'ws';

import { Client } from '..';
import { GatewayError } from '../common/errors';
import {
  GatewayEvent,
  GatewayEventHandler,
  GatewayIdentifyResponse,
} from '../typings/gateway';

interface GatewayEventHandlers {
  [key: string]: GatewayEventHandler;
}

export class Gateway {
  private client: Client;

  private ws: WebSocket;
  private sessionId?: string;

  private handlers: GatewayEventHandlers = {};

  constructor(client: Client) {
    this.client = client;
    this.ws = new WebSocket(this.makeWebsocketUrl(client.baseUrl), {
      timeout: 10000,
    });
    this.bootstrap();
  }

  private bootstrap() {
    this.ws.on('message', async (message) => {
      const [event, data]: GatewayEvent = JSON.parse(message.toString());

      if (event === 'error' || !data.ok) {
        const error = new GatewayError(data.error);
        this.client.emit('error', error);
        return;
      }

      if (event === 'identify') {
        this.setSessionId((data as GatewayIdentifyResponse).data!.sessionId);
        this.client.emit('ready');
        return;
      }

      this.client.emit(event, data);

      if ('notificationId' in data) {
        this.emit('ack', {
          notificationId: data.notificationId,
        });
      }
    });
  }

  public async waitForWebsocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws.on('open', resolve);
      this.ws.on('error', reject);
    });
  }

  private makeWebsocketUrl(baseUrl: string): string {
    return baseUrl.replace(/^http/, 'ws').replace('/api', '/gateway');
  }

  public get hasSession(): boolean {
    return !!this.sessionId;
  }

  public getSessionId(): string {
    return this.sessionId!;
  }

  public setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  public on<T>(event: string, handler: GatewayEventHandler<T>): void {
    this.handlers[event] = handler;
  }

  public off(event: string): void {
    delete this.handlers[event];
  }

  public emit<T = any>(event: string, data?: T): void {
    this.ws.send(JSON.stringify([event, data]));
  }
}