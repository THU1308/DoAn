import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { OrderService } from 'src/app/services/order/order.service';
import { ShoppingCartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-payment-result',
  templateUrl: './payment-result.component.html',
  styleUrls: ['./payment-result.component.scss'],
})
export class PaymentResultComponent implements OnInit {
  isLoading: boolean = true;
  paymentSuccess: boolean | null = null;
  showNotification: boolean = false;
  message: string = '';

  timeoutNotification(milisecon: number) {
    setTimeout(() => {
      this.showNotification = false;
    }, milisecon);
  }

  notification(message: string) {
    this.showNotification = true;
    this.message = message;
    this.timeoutNotification(2000);
  }

  private paymentResultSubject = new BehaviorSubject<string | null>(null); // Tạo BehaviorSubject
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private cartService: ShoppingCartService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.isLoading = true;
      // Gửi tham số trả về từ VNPAY lên backend để xác minh
      debugger;
      if (params['vnp_ResponseCode'] == '00') {
        this.paymentSuccess = true;
        this.isLoading = false;
        debugger;
        this.createOrder();
      } else this.paymentSuccess = false;
      this.isLoading = false;
      this.paymentResultSubject.next('error');
    });
  }

  createOrder() {
    // Kiểm tra xem có thông tin đơn hàng trong sessionStorage không
    const orderData = sessionStorage.getItem('orderBeforePayment');
    if (orderData) {
      const order = JSON.parse(orderData);
      order.paymentStatus = 'completed'; // Cập nhật trạng thái thanh toán
      // Gửi yêu cầu tạo đơn hàng
      this.orderService.addOrder(order).subscribe({
        next: (response: any) => {
          if (response.body.message === 'Success') {
            this.cartService.clearCart(); // Xóa giỏ hàng sau khi thành công
            this.orderService.sendOrderToEmail(order) // gửi mail
            this.notification("Đơn hàng thành công! Cảm ơn bạn đã mua sắm!")
          } else {
            this.notification("Đơn hàng không thành công. Vui lòng thử lại sau.");
          }
        },
        error: (error: any) => {
          console.error('Error creating order:', error);
          alert('Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.');
        },
      });
      // Xóa thông tin đơn hàng trong sessionStorage sau khi xử lý
      sessionStorage.removeItem('orderBeforePayment');
    }
  }
  navigateHome() {
    this.router.navigate(['/']);
  }

  get paymentResult$() {
    return this.paymentResultSubject.asObservable();
  }
}
