import { Component } from '@angular/core';
import { WebSocketService } from '../services/web-socket/web-socket.service';
import { TokenService } from '../services/token.service';
import { ChatMessage } from '../dto/mesage.dto';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  message: string = '';
  messages: ChatMessage[] = [];
  currentUser: string = '';

  constructor(private webSocketService: WebSocketService, private tokenService: TokenService, private userService:UserService) {}
  getCurrentUser() {
    this.userService.getCurrenUserLogin().subscribe({
      next: (res: any) => {
        this.currentUser = res.data.username;
      },
      error: (err) => console.error(err),
    });
  }
  ngOnInit() {
    // Đăng ký nhận phản hồi từ admin
    this.getCurrentUser();

    this.webSocketService.getPrivateMessages().subscribe((message) => {
      debugger
      const msg: ChatMessage = JSON.parse(message);
      if (msg.sender === 'admin') {
        this.messages.push(msg);
      }
    });
  }

  sendMessage() {
    if (this.message.trim()) {
      const chatMessage: ChatMessage = {
        content: this.message,
        sender: this.currentUser,
        receiver: 'admin',
      };
      this.webSocketService.sendMessage(chatMessage);
      this.message = '';
      // Thêm tin nhắn của chính user vào giao diện
      this.messages.push(chatMessage);
    }
  }
}
