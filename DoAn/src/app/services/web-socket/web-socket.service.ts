import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client;
  private messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8088/ws', null, {
        withCredentials: true
      }),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log(new Date(), str);
      }
    });

    this.client.onConnect = (frame) => {
      console.log('Connected: ' + frame);
      this.client.subscribe('/topic/chat', (message) => {
        this.messageSubject.next(message.body);
      });
    };

    this.client.activate();
  }

  public sendMessage(message: string): void {
    this.client.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({ content: message })
    });
  }

  public getMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }
}
