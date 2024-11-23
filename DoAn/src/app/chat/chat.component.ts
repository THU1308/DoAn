import { Component } from '@angular/core';
import { WebSocketService } from '../services/web-socket/web-socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  message: string = '';
  messages: string[] = [];
  constructor(private webSocketService: WebSocketService) {}
  ngOnInit() {
    this.webSocketService.getMessages().subscribe((message: string) => {
      this.messages.push(message);
    });
  }

  sendMessage() {
    if (this.message.trim()) {
      this.webSocketService.sendMessage(this.message);
      this.message = '';
    }
  }
}
