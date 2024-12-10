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
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminSizeComponent } from './admin-size/admin-size.component';
import { AdminBannerComponent } from './admin-banner/admin-banner.component';
import { AdminBlogComponent } from './admin-blog/admin-blog.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { AdminProductComponent } from './admin-product/admin-product.component';
import { AdminInventoryComponent } from './admin-inventory/admin-inventory.component'; 
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { NgxPaginationModule } from 'ngx-pagination';
import { AdminOrderComponent } from './admin-order/admin-order.component';
import { RevenueComponent } from './revenue/revenue.component';
import { BaseChartDirective } from 'ng2-charts';
import { AdminChatComponent } from './admin-chat/admin-chat.component';
import { AdminSlidebarComponent } from './admin-slidebar/admin-slidebar.component';

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
    VndCurrencyPipe, // Giữ lại một lần
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
    AdminProductComponent,
    AdminInventoryComponent,
    AdminOrderComponent,
    RevenueComponent,
    PreloaderComponent,
    AdminChatComponent,
    AdminSlidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSnackBarModule,
    NgxPaginationModule,
    BaseChartDirective,
    MatSnackBarModule,
    NgxPaginationModule
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
