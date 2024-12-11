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
  public users: { [key: string]: { messages: ChatMessage[]; count: number } } =
    {}; // Tất cả các cuộc trò chuyện
  public adminMessages: ChatMessage[] = []; // Lưu tin nhắn admin
  showNotification: boolean = false;
  isLoading: boolean = false;
  messageNotification: string = '';

  timeoutNotification(milisecon: number) {
    setTimeout(() => {
      this.showNotification = false;
    }, milisecon);
  }

  notification(message: string) {
    this.showNotification = true;
    this.messageNotification = message;
    this.timeoutNotification(2000);
  }
  
  constructor(
    private webSocketService: WebSocketService
  ) {}

  ngOnInit() {
    debugger;
    this.webSocketService.getAdminMessages().subscribe((messages: string[]) => {
      debugger;
      // Kiểm tra xem mảng có ít nhất một phần tử hay không
      if (messages.length > 0) {
        // Lấy phần tử cuối cùng trong mảng messages
        const lastMessage = messages[messages.length - 1];
        let msg: ChatMessage;

        try {
          msg = JSON.parse(lastMessage); // Phân tích chuỗi JSON
        } catch (error) {
          console.error('Error parsing message:', error);
          return; // Dừng thực hiện nếu không thể phân tích
        }

        const userId = msg.sender; // Giả sử sender là ID người dùng
        

        // Nếu chưa có cuộc trò chuyện với user, khởi tạo
        if (!this.users[userId]) {
          this.users[userId] = { messages: [], count: 0 };
        }

        // Thêm tin nhắn vào hộp chat của user
        this.users[userId].messages.push(msg);
        this.users[userId].count += 1;

        // Nếu admin đang trò chuyện với user khác, có thể thực hiện một hành động khác nếu cần
        if (this.currentUser !== userId) {
          this.notification(`Bạn có tin nhắn mới từ ${userId}!`);
        }
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
      this.webSocketService.sendReply(chatMessage);   
      if (this.currentUser && this.users[this.currentUser]) {
        this.users[this.currentUser].messages.push(chatMessage);
      }

      this.message = ''; 
    }
  }

  switchChat(userId: string) {
    this.currentUser = userId; 
    this.loadUserChatHistory(userId)
  }

  loadUserChatHistory(userId: string) {
    this.webSocketService.getChatHistory(userId).subscribe((messages) => {
      debugger
      this.users[userId] = { messages: messages, count: messages.length };
      
    });
  }

  // loadAdminChatHistory(userId: string) {
  //   this.webSocketService.getChatHistory(userId).subscribe((messages) => {
  //     debugger
  //     this.adminMessages = messages;
  //   });
  // }
}
