import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatMessage } from '../dto/mesage.dto';
import { WebSocketService } from '../services/web-socket/web-socket.service';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnDestroy, OnInit {
  @Input() showNotification: boolean = false;
  @Input() message: string = '';
  @Output() closeNotification = new EventEmitter<void>();
  private newMessageSubscription: Subscription | null = null;
  lastMessage: ChatMessage | null = null;

  constructor(private webSocketService: WebSocketService) {

  }
  ngOnInit(): void {
    this.newMessageSubscription = this.webSocketService.newMessageReceived.subscribe(
      (message) => {
        this.lastMessage = message;
        this.showNotification = true;
        this.message = `Bạn có tin nhắn mới từ ${this.lastMessage?.sender}`;
      }
    );
  }
  ngOnDestroy() {
    if (this.newMessageSubscription) this.newMessageSubscription.unsubscribe();
  }
  close() {
    this.closeNotification.emit();
  }
}
