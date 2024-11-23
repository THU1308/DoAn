import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartDto } from 'src/app/dto/cart.dto';
import { ShoppingCartService } from 'src/app/services/cart/cart.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit {
  cartItems: CartDto[] = [];
  cartTotal: number = 0;
  currentPage = 1; // Trang hiện tại
  itemsPerPage = 3; // Số lượng sản phẩm trên mỗi trang
  totalPages = 0; // Tổng số trang
  displayedItems: CartDto[] = []; // Danh sách sản phẩm hiển thị

  // Observable để theo dõi số lượng sản phẩm và tổng giá
  cartQuantity$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  cartTotal$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    private cartService: ShoppingCartService,
    private tokenService: TokenService,
  ) {}

  ngOnInit() {
    this.loadCartItems(); // Tải sản phẩm giỏ hàng ngay khi component được khởi tạo
  }

  // Lấy các sản phẩm từ IndexedDB thông qua service và hiển thị
  private async loadCartItems(): Promise<void> {
    const rawCartItems = await this.cartService.getCart(); // Lấy giỏ hàng từ IndexedDB
    // Chuyển đổi các sản phẩm trong giỏ hàng sang CartDto[]
    this.cartItems = rawCartItems.map((item: any) => ({
      productId: item.id,
      productName: item.name,
      productPrice: item.price,
      productQuantity: item.productQuantity || 1, // Nếu không có số lượng, mặc định là 1
      productSize: item.selectedSize || '',
      productImg: item.images?.[0]?.data || '',

      //totalPriceOfItem: item.productPrice * item.productQuantity
    }));
    this.cartService.setCartItems(this.cartItems); // Cập nhật danh sách sản phẩm trong service)
    console.log(this.cartItems[0]);

    this.calculateCartTotal(); // Tính tổng giá giỏ hàng
    this.calculateTotalPages(); // Tính tổng số trang
    this.getDisplayedItems(); // Lấy danh sách sản phẩm để hiển thị
  }

  private calculateCartTotal(): void {
    this.cartTotal = this.cartItems.reduce(
      (sum, item) => sum + item.productPrice * item.productQuantity,
      0,
    );
  }

  private calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.cartItems.length / this.itemsPerPage);
  }

  private getDisplayedItems(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedItems = this.cartItems.slice(startIndex, endIndex);
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId); // Xóa sản phẩm khỏi giỏ hàng trong IndexedDB
    this.loadCartItems(); // Lấy lại các sản phẩm sau khi xóa
  }

  updateQuantity(productId: number, quantity: number) {
    const itemIndex = this.cartItems.findIndex(
      (item) => item.productId === productId,
    );
    if (itemIndex !== -1) {
      this.cartItems[itemIndex].productQuantity = quantity;
      this.calculateCartTotal(); // Cập nhật tổng giá giỏ hàng
      this.calculateTotalPages(); // Tính lại tổng số trang
      this.getDisplayedItems(); // Cập nhật danh sách sản phẩm hiển thị
      this.cartService.updateCartStatus(); // Cập nhật số lượng và tổng tiền trong service)
    }
  }

  // Chuyển sang trang trước
  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getDisplayedItems();
    }
  }

  // Chuyển sang trang sau
  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getDisplayedItems();
    }
  }

  // Chuyển đến một trang cụ thể
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getDisplayedItems();
    }
  }

  // Lấy danh sách các trang để phân trang
  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
