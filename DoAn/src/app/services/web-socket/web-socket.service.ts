import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import { ChatMessage } from 'src/app/dto/mesage.dto';
import { TokenService } from '../token.service';
import { UserService } from '../user/user.service';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private client: Client;
  private adminMessages$ = new BehaviorSubject<string[]>([]); // Thay đổi thành BehaviorSubject
  private privateMessages$ = new BehaviorSubject<string[]>([]); // Thay đổi thành BehaviorSubject
  private currentUser: any = {
    username: '',
    role: '',
  };

  constructor(
    private tokenService: TokenService,
    private userService: UserService
  ) {
    this.getCurrentUser();
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8088/ws'), 
      reconnectDelay: 5000,

      debug: (str) => {
        console.log(str);
      },
    });
    this.registerChanel()
  }

  getCurrentUser() {
    this.userService.getCurrenUserLogin().subscribe({
      next: (res: any) => {
        this.currentUser.username = res.data.username;
        this.currentUser.role = res.data.role.name;
      },
      error: (err) => console.error(err),
    });
  }

  registerChanel() {
    this.client.activate();
    this.client.onConnect = () => {
      const token = this.getUser();
      if (this.currentUser.role == 'ROLE_ADMIN') {
        this.registerAdminChanel();
      } else {
        this.registerUserChanel();
      }
    };
  }

  registerUserChanel() {
    this.client.subscribe(`/user/${this.currentUser.username}/queue/private`, (message) => {
      console.log('Received admin message:', message.body);
      try {
        // Lấy danh sách tin nhắn hiện tại
        const currentMessages = this.privateMessages$.getValue();
  
        // Thêm tin nhắn mới vào danh sách
        this.privateMessages$.next([...currentMessages, message.body]);
  
      } catch (error) {
        console.error('Error parsing message body:', error);
      }
    });
  }

  registerAdminChanel() {
    this.client.subscribe('/topic/admin/chat', (message) => {
      console.log('Received client message:', message.body);
      try {
        // Lấy danh sách tin nhắn hiện tại
        const currentMessages = this.adminMessages$.getValue();
  
        // Thêm tin nhắn mới vào danh sách
        this.adminMessages$.next([...currentMessages, message.body]);
  
      } catch (error) {
        console.error('Error parsing message body:', error);
      }
    });
  }
  

  // Gửi tin nhắn từ user
  sendMessage(chatMessage: ChatMessage): void {
    this.client.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(chatMessage),
    });
  }

  // Gửi phản hồi từ admin
  sendReply(chatMessage: ChatMessage): void {
    this.client.publish({
      destination: '/app/chat.replyMessage',
      body: JSON.stringify(chatMessage),
    });
  }

  // Observable để nhận tin nhắn admin
  getAdminMessages() {
    return this.adminMessages$.asObservable();
  }

  // Observable để nhận phản hồi riêng tư
  getPrivateMessages() {
    return this.privateMessages$.asObservable();
  }

  private getUser(): string {
    return this.currentUser.username;
  }
  
}
