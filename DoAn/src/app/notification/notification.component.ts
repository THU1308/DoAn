import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShoppingCartService } from '../services/cart/cart.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  @Input() showNotification: boolean = false;
  @Input() message: string = '';
  @Output() closeNotification = new EventEmitter<void>();

  close() {
    this.closeNotification.emit();
  }
}
