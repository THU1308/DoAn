import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { openDB, IDBPDatabase } from 'idb';
import { TokenService } from '../token.service';
import { CartDto } from 'src/app/dto/cart.dto';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private dbPromise: Promise<IDBPDatabase>;
  private cartStore: string = 'shopping_cart_guest'; // Biến lưu trữ cartStore

  cartItems$: BehaviorSubject<CartDto[]> = new BehaviorSubject<CartDto[]>([]);
  cartQuantity$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  cartTotal$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private tokenService: TokenService) {
    this.dbPromise = openDB('ShoppingCartDB', 1, {
      upgrade: (db) => {
          db.createObjectStore(`shopping_cart_user`, { keyPath: 'id' });
          db.createObjectStore('shopping_cart_guest', { keyPath: 'id' });
          
        
      },
    });
  }

  async initializeCartOnLogin(): Promise<void> {
    this.dbPromise = openDB('ShoppingCartDB', 1, {
      upgrade: (db) => {
        debugger;
        const token = this.tokenService.getToken();
        db.createObjectStore(`shopping_cart_user`, { keyPath: 'id' });
        db.createObjectStore('shopping_cart_guest', { keyPath: 'id' });
      },
    });
    await this.updateCartStore();
  }

  // Cập nhật cartStore dựa trên trạng thái đăng nhập
  public updateCartStore() {
    if (this.tokenService.isLoggedIn()) {
      this.cartStore = `shopping_cart_user`;
    } else {
      this.cartStore = 'shopping_cart_guest';
    }
  }

  // Cập nhật số lượng và tổng tiền của giỏ hàng
  public async updateCartStatus() {
    const cart = await this.getCart();
    this.cartQuantity$.next(cart.length);
    this.cartTotal$.next(
      cart.reduce(
        (total, item) => total + item.price * (item.productQuantity || 1),
        0,
      ),
    );
  }

  public async loadUserCart(): Promise<void> {
    this.updateCartStore();
    const cart = await this.getCart();
    this.cartItems$.next(cart);
    await this.updateCartStatus();
  }
  // Lấy tất cả sản phẩm trong giỏ hàng từ IndexedDB
  async getCart(): Promise<any[]> {
    const db = await this.dbPromise;
    const userId = this.tokenService.getToken(); // Lấy userId từ token
    if (this.tokenService.isLoggedIn()) {
      return await db.getAll(this.cartStore).then(
        (cartItems) => cartItems.filter((item) => item.userId === userId), // Chỉ lấy sản phẩm của người dùng hiện tại
      );
    }
    return await db.getAll(this.cartStore); // Lấy tất cả sản phẩm cho khách
  }

  async addToCart(product: any, selectedSize: string): Promise<void> {
    const db = await this.dbPromise;
    const userId = this.tokenService.getToken(); // Lấy user ID từ token
    if (!userId) {
      throw new Error("Người dùng chưa đăng nhập.");
    }

    // Tạo khóa duy nhất cho sản phẩm dựa trên userId, productId và selectedSize
    const uniqueKey = `${userId}-${product.id}-${selectedSize}`;

    // Kiểm tra sự tồn tại của sản phẩm với size đã chọn trong giỏ hàng
    const existingProduct = await db.get(this.cartStore, uniqueKey);

    if (!existingProduct) {
      // Thêm sản phẩm vào giỏ hàng với size
      const productWithSize = {
        ...product,
        id: uniqueKey,
        userId
      };
      await db.put(this.cartStore, productWithSize);
      this.updateCartStatus(); // Cập nhật trạng thái giỏ hàng
    } else {
      console.warn(
        `Product ID ${product.id} with size ${selectedSize} already exists in the cart.`
      );
    }
  }


  async getCartItemById(productId: number, selectedSize: string): Promise<any | undefined> {
    const db = await this.dbPromise;
    const userId = this.tokenService.getToken();
    const uniqueKey = `${userId}-${productId}-${selectedSize}`; // Bao gồm cả kích thước
    const product = await db.get(this.cartStore, uniqueKey);
    return product || undefined;
  }


  // Xóa sản phẩm khỏi giỏ hàng
  async removeFromCart(productId: number): Promise<void> {
    const db = await this.dbPromise;
    const userId = this.tokenService.getToken(); // Lấy userId từ token
    const cartItems = await db.getAll(this.cartStore); // Lấy tất cả sản phẩm trong giỏ hàng

    // Tìm sản phẩm trong giỏ hàng của người dùng hiện tại
    const product = cartItems.find((item) => item.userId === userId);

    if (product) {
      await db.delete(this.cartStore, productId); // Xóa sản phẩm
      this.updateCartStatus(); // Cập nhật trạng thái giỏ hàng
    } else {
      console.warn(
        `Product with ID ${productId} does not belong to the current user.`,
      );
    }
  }

  // Xóa tất cả sản phẩm trong giỏ hàng
  async clearCart(): Promise<void> {
    const db = await this.dbPromise;
    const userId = this.tokenService.getToken(); // Lấy userId từ token
    const cart = await this.getCart();

    // Xóa sản phẩm của người dùng hiện tại
    const userProducts = cart.filter((item) => item.userId === userId);
    const tx = db.transaction(this.cartStore, 'readwrite');
    const store = tx.objectStore(this.cartStore);

    for (const product of userProducts) {
      await store.delete(product.id);
    }

    await tx.done; // Hoàn tất giao dịch
    this.cartQuantity$.next(0); // Reset số lượng giỏ hàng
    this.cartTotal$.next(0); // Reset tổng tiền giỏ hàng
  }

  // Hàm saveCart để lưu toàn bộ giỏ hàng vào IndexedDB
  async saveCart(cartItems: any[]): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction(this.cartStore, 'readwrite');
    const store = tx.objectStore(this.cartStore);

    await store.clear(); // Xóa giỏ hàng cũ

    for (const item of cartItems) {
      await store.put(item); // Thêm từng sản phẩm vào giỏ hàng
    }

    await tx.done; // Hoàn tất giao dịch
    this.updateCartStatus(); // Cập nhật trạng thái giỏ hàng
  }

  getCartItems(): CartDto[] {
    return this.cartItems$.getValue();
  }

  setCartItems(cartItems: CartDto[]): void {
    this.cartItems$.next(cartItems);
  }

  getCartQuantity(): BehaviorSubject<number> {
    return this.cartQuantity$;
  }

  getCartTotal(): BehaviorSubject<number> {
    return this.cartTotal$;
  }
}
