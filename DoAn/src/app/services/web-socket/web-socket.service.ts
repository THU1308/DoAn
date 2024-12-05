import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import { Subject } from 'rxjs';
import { ChatMessage } from 'src/app/dto/mesage.dto';
import { TokenService } from '../token.service';
import { UserService } from '../user/user.service';
import * as SockJS from 'sockjs-client';


@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private client: Client;
  private adminMessages$ = new Subject<string>();
  private privateMessages$ = new Subject<string>();
  private currentUser: any;

  getCurrentUser() {
    this.userService.getCurrenUserLogin().subscribe({
      next: (res: any) => {
        this.currentUser = res.data.username;
      },
      error: (err) => console.error(err),
    });
  }

  constructor(
    private tokenService: TokenService,
    private userService: UserService
  ) {
    this.getCurrentUser();
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8088/ws'), // Sử dụng SockJS
      reconnectDelay: 5000,
      connectHeaders: {
        // Nếu cần thiết, bạn có thể thêm tiêu đề như Authorization hoặc bất kỳ thông tin nào khác
        Authorization: `Bearer ${this.tokenService.getToken()}`,
      },
      debug: (str) => { console.log(str); },
  });
    this.client.activate();

    this.client.onConnect = () => {
      // Đăng ký kênh sau khi kết nối thành công
    
        
        const token = this.getUser();
       
        this.registerUserChanel(token);
  
    
      this.client.subscribe('/topic/admin/chat', (message) => {
        console.log('Received client message:', message.body);
        this.adminMessages$.next(message.body); // Đẩy dữ liệu vào Subject
      });
    };

    
  }

  registerUserChanel(token: String) {
    // Đăng ký kênh để nhận tin nhắn riêng tư từ admin
    this.client.subscribe(`/user/${this.currentUser}/queue/private`, (message) => {
      debugger
      console.log('Received private message:', message.body);
      this.privateMessages$.next(message.body); // Đẩy dữ liệu vào Subject
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
    // Lấy thông tin user hiện tại (token hoặc username)
    
    return this.currentUser;
  }
}
