import { Component } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { Route, Router } from '@angular/router';
import { ShoppingCartService } from 'src/app/services/cart/cart.service';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  cartQuantity$: BehaviorSubject<number> = new BehaviorSubject<number>(0); // Sử dụng BehaviorSubject
  cartTotal$: BehaviorSubject<number> = new BehaviorSubject<number>(0); // Sử dụng BehaviorSubject

    constructor(
    private tokenService : TokenService,
    private cartService : ShoppingCartService,
  ){}

  async ngOnInit() {
    //const cart = await this.cartService.getCart
    this.cartService.cartQuantity$.subscribe(quantity => {
      this.cartQuantity$.next(quantity);
    });
    this.cartService.cartTotal$.subscribe(total => {
      this.cartTotal$.next(total);
    });
  }

  getTotalPrice(){
    //this.cartService.updateCartStatus()
    return this.cartTotal$;
  }

  getCartQuantity(){
    return this.cartQuantity$;
  }

  checkLogin():boolean{
    return this.tokenService.isLoggedIn();
  }
  logout(){
    this.tokenService.removeToken();
    this.cartService.clearCart();
    alert('Đăng xuất thành công');
  }
}
