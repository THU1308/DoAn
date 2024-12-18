import { Component } from '@angular/core';
import { LoginDto } from '../../dto/login.dto';
import { UserService } from '../../services/user/user.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { ShoppingCartService } from 'src/app/services/cart/cart.service';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';

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
          debugger
          this.cartService.initializeCartOnLogin()
          this.cartService.loadUserCart()
          this.router.navigate(['']);
          alert('Đăng nhập thành công');
        } else {
          alert('Đăng nhập thất bại');
        }
      },
      error: (error: any) => {
        alert(`Lỗi: ${error.error}`);
      },
    });
  }
}
