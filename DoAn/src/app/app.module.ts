import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlogComponent } from './component/blog/blog.component';
import { HomeComponent } from './component/home/home.component';
import { ShopComponent } from './component/shop/shop.component';
import { ShoppingCartComponent } from './component/shopping-cart/shopping-cart.component';
import { HeaderComponent } from './component/header/header.component';
import { BannerComponent } from './component/banner/banner.component';
import { FooterComponent } from './component/footer/footer.component';
import { ProductDetailsComponent } from './component/product-details/product-details.component';
import { BlogDetailsComponent } from './component/blog-details/blog-details.component';
import { ContactComponent } from './component/contact/contact.component';
import { LoginComponent } from './component/login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { VndCurrencyPipe } from './vnd-currency.pipe';
import { PreloaderComponent } from './preloader/preloader.component';
import { BlogPageComponent } from './component/blog-page/blog-page.component';
import { NotificationComponent } from './notification/notification.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { CheckOutComponent } from './component/check-out/check-out.component';
import { PaymentResultComponent } from './component/payment-result/payment-result.component';
import { ChatComponent } from './chat/chat.component';
import { CategoryAdminComponent } from './category-admin/category-admin.component';
import { ButtonModule } from 'primeng/button';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminSizeComponent } from './admin-size/admin-size.component';
import { AdminBannerComponent } from './admin-banner/admin-banner.component';
import { AdminBlogComponent } from './admin-blog/admin-blog.component';
import { AdminUserComponent } from './admin-user/admin-user.component'; 


@NgModule({
  declarations: [
    AppComponent,
    BlogComponent,
    HomeComponent,
    ShopComponent,
    ShoppingCartComponent,
    HeaderComponent,
    BannerComponent,
    FooterComponent,
    ProductDetailsComponent,
    BlogDetailsComponent,
    ContactComponent,
    LoginComponent,
    VndCurrencyPipe,
    PreloaderComponent,
   BlogPageComponent,
   NotificationComponent,
   CheckOutComponent,
   PaymentResultComponent,
   ChatComponent,
   CategoryAdminComponent,
   DashboardComponent,
   AdminSizeComponent,
   AdminBannerComponent,
   AdminBlogComponent,
   AdminUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
