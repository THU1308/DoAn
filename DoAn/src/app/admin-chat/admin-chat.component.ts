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
  constructor(
    private webSocketService: WebSocketService,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    debugger;
    //this.loadMessagesFromLocalStorage();
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
    //this.loadPreviousMessages();
  }

  private loadPreviousMessages() {
    // Nạp tin nhắn cũ từ admin
    this.webSocketService.getAdminMessages().subscribe((messages: string[]) => {
      this.updateAdminMessages(messages);
      console.log('Admin: ' + messages);
    });

    // Nạp tin nhắn cũ từ người dùng
    this.webSocketService
      .getPrivateMessages()
      .subscribe((messages: string[]) => {
        this.updateChatMessages(messages);
        console.log(console.log('User: ' + messages));
      });
  }

  // Phương thức để tải tin nhắn từ localStorage
  private loadMessagesFromLocalStorage(): void {
    const savedPrivateMessages = localStorage.getItem('privateMessages');
    if (savedPrivateMessages) {
      const messages: string[] = JSON.parse(savedPrivateMessages);
      this.updateChatMessages(messages); // Cập nhật tin nhắn cũ cho người dùng
    }

    const savedAdminMessages = localStorage.getItem('adminMessages');
    if (savedAdminMessages) {
      const messages: string[] = JSON.parse(savedAdminMessages);
      this.updateAdminMessages(messages); // Cập nhật tin nhắn cũ cho admin
    }
  }

  private updateChatMessages(messages: any[]) {
    messages.forEach((message) => {
      const userId = message.sender; // Giả sử sender là ID người dùng

      if (!this.users[userId]) {
        this.users[userId] = { messages: [], count: 0 };
      }
      this.users[userId].messages.push(message);
      this.users[userId].count += 1;
    });
    console.log('User: ' + messages);
  }

  private updateAdminMessages(messages: any[]) {
    messages.forEach((message) => {
      try {
        let msg: ChatMessage = JSON.parse(message); // Phân tích chuỗi JSON

        // Kiểm tra xem msg.sender có tồn tại trong this.users không
        if (!this.users[msg.sender]) {
          this.users[msg.sender] = { messages: [], count: 0 }; // Khởi tạo nếu chưa có
        }

        // Thêm vào danh sách tin nhắn admin
        this.users[msg.sender].messages.push(msg);
        this.users[msg.sender].count += 1; // Cập nhật số lượng tin nhắn nếu cần
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });
    console.log('Admin messages:', messages);
  }
}
