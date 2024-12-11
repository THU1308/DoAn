import { EventEmitter, Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from 'src/app/dto/mesage.dto';
import { TokenService } from '../token.service';
import { UserService } from '../user/user.service';
import * as SockJS from 'sockjs-client';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private client: Client;
  private adminMessages$ = new BehaviorSubject<string[]>([]); 
  private privateMessages$ = new BehaviorSubject<string[]>([]); 
  private currentUser: any = {
    username: '',
    role: '',
  };
  public newMessageReceived = new EventEmitter<ChatMessage>();

  constructor(
    private userService: UserService,
    private http: HttpClient
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
      const msg: ChatMessage = JSON.parse(message.body);
      // Phát tín hiệu tin nhắn mới
      this.newMessageReceived.emit(msg); 
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

   // Phương thức để lấy lịch sử trò chuyện
   getChatHistory(userId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`http://localhost:8088/chat/history/${userId}`);
  }
  
}
