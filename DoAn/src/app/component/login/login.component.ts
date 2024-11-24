import { Component } from '@angular/core';
import { LoginDto } from '../../dto/login.dto';
import { UserService } from '../../services/user/user.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { ShoppingCartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  userName: string = '';
  password: string = '';
  myScriptElement: HTMLScriptElement;

  constructor(
    private userService: UserService,
    private router: Router,
    private tokenService: TokenService,
    private cartService: ShoppingCartService,
  ) {
    this.myScriptElement = document.createElement('script');
    this.myScriptElement.src = 'assets/login.component.js';
    this.myScriptElement.type = 'text/javascript';
    this.myScriptElement.async = true;
    document.body.appendChild(this.myScriptElement);
  }

  onLogin() {
    const loginDto: LoginDto = {
      userName: this.userName,
      password: this.password,
    };

    this.userService.login(loginDto).subscribe({
      next: (response: any) => {
        debugger
        if (response.message === 'Success') {
          this.tokenService.setToken(response.data.token);
          
          this.cartService.updateCartStatus();
          alert('Đăng nhập thành công');
          
          this.router.navigate(['']);
        } else {
          alert('Đăng nhập thất bại');
        }
      },
      error: (error: any) => {
        alert(`Lỗi: ${error.error}`);
      },
    });
  }

  logout() {
    this.tokenService.removeToken(); // Xóa token khi logout
    // KHÔNG CẦN ĐẶT LẠI cartStore
    // this.cartService.cartStore = 'shopping_cart_guest'; // Quay lại giỏ hàng khách
    this.cartService.updateCartStatus(); // Cập nhật số lượng và tổng tiền
    //this.cartService.cartQuantity$.next(0);
    //this.cartService.cartTotal$.next(0);
  }
}
