import { Component } from '@angular/core';
import { ChatMessage } from '../dto/mesage.dto';
import { WebSocketService } from '../services/web-socket/web-socket.service';
@Component({
  selector: 'app-admin-chat',
  templateUrl: './admin-chat.component.html',
  styleUrls: ['./admin-chat.component.scss'],
})
export class AdminChatComponent {
  message: string = '';
  public currentUser: string = ''; // Người dùng hiện tại mà admin đang trò chuyện
  public users: { [key: string]: { messages: ChatMessage[]; count: number; unread: 0 } } =
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
  ) { }

  ngOnInit() {
    debugger;
    this.webSocketService.getAdminMessages().subscribe((messages: string[]) => {
      debugger;

      if (messages.length > 0) {

        const lastMessage = messages[messages.length - 1];
        let msg: ChatMessage;

        try {
          msg = JSON.parse(lastMessage);
        } catch (error) {
          console.error('Error parsing message:', error);
          return;
        }

        const userId = msg.sender;

        if (!this.users[userId]) {
          this.users[userId] = { messages: [], count: 0, unread: 0 };
        }

        this.users[userId].messages.push(msg);
        this.users[userId].count += 1;

        if (this.currentUser !== userId) {
          this.users[userId].unread++;
          //this.notification(`Bạn có tin nhắn mới từ ${userId}!`);
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
        timeStamp: new Date().toISOString(),
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
    this.users[userId].unread = 0;
    this.loadUserChatHistory(userId)
  }

  loadUserChatHistory(userId: string) {
    this.webSocketService.getChatHistory(userId).subscribe((messages) => {
      debugger
      this.users[userId] = { messages: messages, count: messages.length, unread: 0 };

    });
  }

  // loadAdminChatHistory(userId: string) {
  //   this.webSocketService.getChatHistory(userId).subscribe((messages) => {
  //     debugger
  //     this.adminMessages = messages;
  //   });
  // }
}
