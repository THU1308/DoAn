import { Component } from '@angular/core';
import { CartDto } from '../../dto/cart.dto';
import { ShoppingCartService } from '../../services/cart/cart.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { OrderDto } from '../../dto/order.dto';
import { OrderService } from '../../services/order/order.service';
import { NgForm } from '@angular/forms';
import { PaymentService } from '../../services/payment/paymentService';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user/user.service';
@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss'],
})
export class CheckOutComponent {
  cartItems: CartDto[] = [];
  cartTotal: number = 0;
  currentUserNameLogin : string = '';

  isLoading: boolean = false;

  //Notification
  showNotification: boolean = false;
  message: string = '';

  order: OrderDto = {
    firstName: '',
    lastName: '',
    country: '',
    address: '',
    town: '',
    state: '',
    postCode: 0,
    email: '',
    note: '',
    phone: '',
    username: '',
    totalPrice: 0,
    paymentStatus: '',
    orderDetailDTOS: [], // Initialize as an empty array
  };

  // Observable để theo dõi số lượng sản phẩm và tổng giá
  cartQuantity$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  cartTotal$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    private cartService: ShoppingCartService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private tokenService: TokenService,
    private userService : UserService
  ) {}

  private paymentResultSubscription: Subscription | undefined;
  getCurrentUser() {
    this.userService.getCurrenUserLogin().subscribe({
      next: (res: any) => {
        this.currentUserNameLogin = res.data.username;
      },
      error: (err) => console.error(err),
    });
  }

  ngOnInit() {
    this.cartService.updateCartStore()
    this.cartService.loadUserCart()
    this.loadCartItems(); // Tải sản phẩm giỏ hàng ngay khi component được khởi tạo)
    //console.log(this.cartService.getCartItems());
    this.getCurrentUser();
  }

  ngOnDestroy() {
    if (this.paymentResultSubscription) {
      this.paymentResultSubscription.unsubscribe();
    }
  }

  private async loadCartItems(): Promise<void> {
    const rawCartItems = await this.cartService.getCart(); // Lấy giỏ hàng từ IndexedDB
    console.log(this.tokenService.getToken())
    console.log(rawCartItems);
    // Chuyển đổi các sản phẩm trong giỏ hàng sang CartDto[]
    this.cartItems = rawCartItems.map((item: any) => ({
      productId:  parseInt(item.id.toString().split('-')[1], 10),
      productName: item.name,
      productPrice: item.price,
      productQuantity: item.productQuantity || 1, // Nếu không có số lượng, mặc định là 1
      productSize: item.selectedSize || '',
      productImg: item.images?.[0]?.data || '',
      //totalPriceOfItem: item.productPrice * item.productQuantity
    }));
    this.cartService.setCartItems(this.cartItems); // Cập nhật danh sách sản phẩm trong service)
    this.cartTotal = this.cartItems.reduce(
      (sum, item) => sum + item.productPrice * item.productQuantity,
      0,
    );
    console.log(this.cartItems);
  }

  timeoutNotification(milisecon: number) {
    setTimeout(() => {
      this.showNotification = false;
    }, milisecon);
  }

  // Hàm xử lý khi người dùng submit form
  selectedPaymentMethod: string = '';
  onSubmit(form: NgForm) {
    this.isLoading = true;
    if (form.invalid) {
      this.showNotification = true;
      this.message = 'Vui lòng điền đầy đủ thông tin';
      this.timeoutNotification(2000);
      return;
    }

    // Now process based on selectedPaymentMethod
    if (this.selectedPaymentMethod === 'COD') {
      debugger
      this.selectedPaymentMethod = 'pending';
      debugger  
      this.processCODOrder(form);
    } else if (this.selectedPaymentMethod === 'VNPay') {
      this.makePayment(form);
      this.selectedPaymentMethod = 'completed';  
      this.processVNPayOrder(form);  
    } else {
      this.isLoading = false;
      this.showNotification = true;
      this.message = 'Invalid payment method selected.';
      this.timeoutNotification(2000);
      return;
    }
  }

  paymentResult: string = '';

  processCODOrder(form: NgForm) {
    this.order = {
      ...this.order,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      country: form.value.country,
      address: form.value.address,
      town: form.value.town,
      state: form.value.state,
      postCode: form.value.postCode,
      email: form.value.email,
      note: form.value.note,
      phone: form.value.phone,
      totalPrice: this.cartTotal,
      paymentStatus: this.selectedPaymentMethod,
      username : this.currentUserNameLogin
    };
   
    // Cập nhật chi tiết đơn hàng
    this.order.orderDetailDTOS = this.cartItems.map((item) => ({
      productId: item.productId,
      price: item.productPrice,
      quantity: item.productQuantity,
      subTotal: item.productPrice * item.productQuantity,
      sizeId: item.productSize ? item.productSize.id : null,
    }));
    //alert(JSON.stringify(this.order))
    // Gửi yêu cầu tạo đơn hàng
    this.orderService.addOrder(this.order).subscribe({
      next: (response: any) => {
        if (response.body.message == 'Success') {
          this.cartService.clearCart();
          this.isLoading = false;
          this.showNotification = true;
          this.message = 'Order thành công';
          this.timeoutNotification(2000);
        } else {
          this.isLoading = false;
          this.showNotification = true;
          this.message = 'Order không thành công. Vui lòng thử lại sau.';
          this.timeoutNotification(2000);
        }
        this.cartService.clearCart();
      },
      error: (error: any) => {
        console.error('Error creating order:', error);
        alert('There was an issue creating your order. Please try again.');
      },
    });
  }

  processVNPayOrder(form: NgForm) {
    this.order = {
      ...this.order,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      country: form.value.country,
      address: form.value.address,
      town: form.value.town,
      state: form.value.state,
      postCode: form.value.postCode,
      email: form.value.email,
      note: form.value.note,
      phone: form.value.phone,
      totalPrice: this.cartTotal,
      paymentStatus: this.selectedPaymentMethod,
      username : this.currentUserNameLogin
    };

    // Cập nhật chi tiết đơn hàng
    this.order.orderDetailDTOS = this.cartItems.map((item) => ({
      productId:  item.productId,
      price: item.productPrice,
      quantity: item.productQuantity,
      subTotal: item.productPrice * item.productQuantity,
      sizeId: item.productSize ? item.productSize.id : null,
    }));
    sessionStorage.setItem('orderBeforePayment', JSON.stringify(this.order));
  }

  makePayment(form : NgForm) {
    this.paymentService.createPayment(this.cartTotal).subscribe({
      next: (response: any) => {
        debugger;
        if (response.data != null) {
          window.location.href = response.data.paymentUrl;

        } else {
          this.isLoading = false;
          this.showNotification = true;
          this.message = 'Order không thành công. Vui lòng thử lại sau.';
          this.timeoutNotification(2000);
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.showNotification = true;
        this.message =
          'Không thể tạo yêu cầu thanh toán. Vui lòng thử lại sau.';
        this.timeoutNotification(2000);
      },
    });
  }

  getCartTotal() {
    return this.cartService.getCartTotal();
  }

  getCartQuantity() {
    return this.cartService.getCartQuantity();
  }
}
