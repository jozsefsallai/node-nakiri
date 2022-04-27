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

  private reconnecting: boolean;

  constructor(client: Client, reconnecting: boolean = false) {
    this.client = client;
    this.ws = new WebSocket(this.makeWebsocketUrl(client.baseUrl), {
      timeout: 10000,
    });
    this.reconnecting = reconnecting;
    this.bootstrap();
  }

  private bootstrap() {
    this.ws.on('message', async (message) => {
      const [event, res]: GatewayEvent = JSON.parse(message.toString());

      if (event === 'error' || event === 'gatewayError' || !res.ok) {
        const error = new GatewayError(res.error);
        this.client.emit('error', error);
        return;
      }

      if (event === 'identify') {
        this.setSessionId((res as GatewayIdentifyResponse).data!.sessionId);
        this.reconnecting = false;
        this.client.emit('ready');
        return;
      }

      if (event === 'reconnect') {
        this.reconnecting = false;
        this.client.emit('ready');
        return;
      }

      const { data } = res;

      this.client.emit(event, data);

      if (data && 'notificationId' in data) {
        this.emit('ack', {
          notificationId: data.notificationId,
        });
      }
    });

    this.ws.on('close', this.client.attemptToReconnect.bind(this.client));
  }

  public async waitForWebsocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws.readyState === WebSocket.OPEN) {
        return resolve();
      }

      if (this.ws.readyState === WebSocket.CLOSED) {
        return reject();
      }

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

  public unsetSessionId(): void {
    this.sessionId = undefined;
  }

  public isReconnecting(): boolean {
    return this.reconnecting;
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
