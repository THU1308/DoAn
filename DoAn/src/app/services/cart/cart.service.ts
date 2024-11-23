import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { openDB, IDBPDatabase } from 'idb';
import { TokenService } from '../token.service';
import { CartDto } from 'src/app/dto/cart.dto';

@Injectable({
  providedIn: 'root'
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
        if (!db.objectStoreNames.contains('shopping_cart_guest')) {
          db.createObjectStore('shopping_cart_guest', { keyPath: 'id' });
        }

        // Tạo store cho người dùng nếu cần
        const token = this.tokenService.getToken();
        if (token && !db.objectStoreNames.contains(`shopping_cart_${token}`)) {
          db.createObjectStore(`shopping_cart_${token}`, { keyPath: 'id' });
        }
      }
    });

  }


  // Cập nhật cartStore dựa trên trạng thái đăng nhập
  private updateCartStore() {
    if (this.tokenService.isLoggedIn()) {
      this.cartStore = `shopping_cart_${this.tokenService.getToken()}`;
    } else {
      this.cartStore = 'shopping_cart_guest';
    }
  }

  // Cập nhật số lượng và tổng tiền của giỏ hàng
  public async updateCartStatus() {
    const cart = await this.getCart();
    this.cartQuantity$.next(cart.length);
    this.cartTotal$.next(cart.reduce((total, item) => total + item.price * (item.productQuantity || 1), 0));
  }

  // Lấy tất cả sản phẩm trong giỏ hàng từ IndexedDB
  async getCart(): Promise<any[]> {
    const db = await this.dbPromise;
    return await db.getAll(this.cartStore);
  }

  // Thêm sản phẩm vào giỏ hàng
  async addToCart(product: { id: number;[key: string]: any }): Promise<void> {
    const db = await this.dbPromise;
    const existingProduct = await db.get(this.cartStore, product.id);
    if (!existingProduct) {
      await db.add(this.cartStore, product);
      this.updateCartStatus();
      console.log(this.getCartItems())

    } else {
      console.warn(`Product with ID ${product.id} already exists in the cart.`);
    }
  }

  // Lấy sản phẩm chỉ định từ giỏ hàng
  async getCartItemById(productId: number): Promise<any | undefined> {
    const db = await this.dbPromise;
    return await db.get(this.cartStore, productId);
  }

  // Xóa sản phẩm khỏi giỏ hàng
  async removeFromCart(productId: number): Promise<void> {
    const db = await this.dbPromise;
    await db.delete(this.cartStore, productId);
    this.updateCartStatus();
  }

  // Xóa tất cả sản phẩm trong giỏ hàng
  async clearCart(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear(this.cartStore);
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
