import { Component } from '@angular/core';
import { ChatMessage } from '../dto/mesage.dto';
import { WebSocketService } from '../services/web-socket/web-socket.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-admin-chat',
  templateUrl: './admin-chat.component.html',
  styleUrls: ['./admin-chat.component.scss'],
})
export class AdminChatComponent {
  message: string = '';
  public currentUser: string = ''; // Người dùng hiện tại mà admin đang trò chuyện
  public users: { [key: string]: { messages: ChatMessage[]; count: number } } = {}; // Tất cả các cuộc trò chuyện

  constructor(private webSocketService: WebSocketService, private tokenService: TokenService) {}

  ngOnInit() {
    // Đăng ký nhận tin nhắn từ user
    this.webSocketService.getAdminMessages().subscribe((message) => {
      const msg: ChatMessage = JSON.parse(message);
      const userId = msg.sender; // Giả sử sender là ID người dùng

      // Nếu chưa có cuộc trò chuyện với user, khởi tạo
      if (!this.users[userId]) {
        this.users[userId] = { messages: [], count: 0 };
      }

      // Thêm tin nhắn vào hộp chat của user
      this.users[userId].messages.push(msg);
      this.users[userId].count += 1;

      // Nếu admin đang trò chuyện với user khác, không chuyển đổi
      if (this.currentUser !== userId) {
        // Nếu người dùng khác gửi tin nhắn, có thể thực hiện một hành động khác nếu cần
      }
    });
  }

  sendMessage() {
    if (this.message.trim()) {
      const chatMessage: ChatMessage = {
        content: this.message,
        sender: 'admin',
        receiver: this.currentUser,
      };

      // Gửi tin nhắn qua WebSocket
      this.webSocketService.sendReply(chatMessage);

      // Thêm tin nhắn của admin vào cuộc trò chuyện hiện tại
      if (this.currentUser && this.users[this.currentUser]) {
        this.users[this.currentUser].messages.push(chatMessage);
      }

      this.message = ''; // Xóa ô nhập
    }
  }

  switchChat(userId: string) {
    this.currentUser = userId; // Chuyển đổi người dùng hiện tại
  }
}
