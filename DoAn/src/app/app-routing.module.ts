import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './component/blog/blog.component';
import { HomeComponent } from './component/home/home.component';
import { ShopComponent } from './component/shop/shop.component';
import { ShoppingCartComponent } from './component/shopping-cart/shopping-cart.component';
import { ProductDetailsComponent } from './component/product-details/product-details.component';
import { BlogDetailsComponent } from './component/blog-details/blog-details.component';
import { ContactComponent } from './component/contact/contact.component';
import { LoginComponent } from './component/login/login.component';
import { BlogPageComponent } from './component/blog-page/blog-page.component';
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


const routes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'blog', component: BlogComponent }, 
  { path:'shop',  component: ShopComponent},
  { path:'cart', component: ShoppingCartComponent},
  { path: 'product/:id', component: ProductDetailsComponent},
  { path: 'blog-details/:id', component: BlogDetailsComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'login', component: LoginComponent},
  { path: 'blog-page', component: BlogPageComponent},
  { path: 'check-out', component: CheckOutComponent},
  { path: 'vnpay_return', component: PaymentResultComponent},
  { path: 'chat', component: ChatComponent},
  { path: 'admin/category', component: CategoryAdminComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'admin/size', component: AdminSizeComponent},
  { path: 'admin/banner', component: AdminBannerComponent},
  { path: 'admin/blog', component: AdminBlogComponent},
  { path: 'admin/user', component: AdminUserComponent},
  { path: 'admin/product', component: AdminProductComponent},
  {path:'admin/inventory',component: AdminInventoryComponent},
  { path: '**', redirectTo: '' },
];

@NgModule({

  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
