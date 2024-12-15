import { Component } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { Route, Router } from '@angular/router';
import { ShoppingCartService } from 'src/app/services/cart/cart.service';
import { BehaviorSubject } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language/languageService';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  cartQuantity$: BehaviorSubject<number> = new BehaviorSubject<number>(0); 
  cartTotal$: BehaviorSubject<number> = new BehaviorSubject<number>(0); 
  userName : string = '';
  
  currentUser : any = {
    username : '',
    role : ''
  }

    constructor(
    private tokenService : TokenService,
    private cartService : ShoppingCartService,
    private userService : UserService,
    private translate : TranslateService,
    public languageService: LanguageService

  ){
    
  }

  changeLanguage(lang: string) {
    this.languageService.changeLanguage(lang);
  }

  async ngOnInit() {
    //const cart = await this.cartService.getCart
    this.cartService.cartQuantity$.subscribe(quantity => {
      this.cartQuantity$.next(quantity);
    });
    this.cartService.cartTotal$.subscribe(total => {
      this.cartTotal$.next(total);
    });
    this.getCurrentUser()
  }

  getCurrentUser() {
    this.userService.getCurrenUserLogin().subscribe({
      next: (res: any) => {
        debugger
        this.currentUser.username = res.data.username;
        this.currentUser.role = res.data.role.name;
      },
      error: (err) => console.error(err),
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
    this.cartService.updateCartStore()
    this.cartService.updateCartStatus()
    this.cartService.loadUserCart()
    alert('Đăng xuất thành công');
  }
}
