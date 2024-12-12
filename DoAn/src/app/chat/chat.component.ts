import { Component, ElementRef, ViewChild } from '@angular/core';
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

  constructor(
    private webSocketService: WebSocketService,
    private tokenService: TokenService,
    private userService: UserService
  ) { }
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

    this.webSocketService
      .getPrivateMessages()
      .subscribe((messages: string[]) => {
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

          if (userId == 'admin') {
            this.messages.push(msg);
          }
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
        sender: this.currentUser,
        receiver: 'admin',
        timeStamp: new Date().toISOString(),
      };
      this.webSocketService.sendMessage(chatMessage);
      this.message = '';
      // Thêm tin nhắn của chính user vào giao diện 
      this.messages.push(chatMessage);
    }
  }

  isChatOpen: boolean = false; // Trạng thái mở hộp chat
  toggleChat() {
    this.loadUserChatHistory(this.currentUser)
    this.isChatOpen = !this.isChatOpen;
    const chatBox = document.querySelector('.chat-container') as HTMLElement;
    const wrapper = document.querySelector('.wrapper') as HTMLElement;

    if (chatBox && wrapper) {
      if (this.isChatOpen) {
        chatBox.classList.add('active');
        wrapper.classList.add('active');
      } else {
        chatBox.classList.remove('active');
        wrapper.classList.remove('active');
      }
    }
  }

  loadUserChatHistory(userId: string) {
    this.webSocketService.getChatHistory(userId).subscribe((messages) => {
      debugger
      this.messages = messages;

    });
  }
  @ViewChild('chatBox') private chatBox!: ElementRef;
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
  scrollToBottom(): void {
    try {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    } catch (err) { }
  }

}
