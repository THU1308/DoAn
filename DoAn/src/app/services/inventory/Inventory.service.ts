import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductSize } from 'src/app/dto/product-size.dto';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private apiUrl = 'http://localhost:8088/api/v1/inventory'; // Thay bằng URL API của bạn

  constructor(private http: HttpClient) {}

  // Tạo headers
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  private getToken(): string {
    // Hàm giả định để lấy token từ localStorage hoặc từ dịch vụ xác thực
    return localStorage.getItem('token') || '';
  }

  // Lấy tổng số lượng tồn kho
  getTotalStock(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total`, {
      headers: this.headers,
    });
  }

  // Lấy danh sách sản phẩm gần hết hàng
  getLowStockProducts(threshold: number): Observable<ProductSize[]> {
    return this.http.get<ProductSize[]>(`${this.apiUrl}/low-stock`, {
        headers: this.headers,
      params: { threshold: threshold.toString() },
    });
  }

  // Lấy danh sách tồn kho theo ID sản phẩm
  getStockByProduct(productId: number): Observable<ProductSize[]> {
    return this.http.get<ProductSize[]>(`${this.apiUrl}/${productId}`, {
        headers: this.headers,
    });
  }

  // Cập nhật số lượng sản phẩm theo size
  updateStock(productId: number, sizeId: number, quantity: number): Observable<ProductSize> {
    // Tạo URL với query parameters
    const url = `${this.apiUrl}/update?productId=${productId}&sizeId=${sizeId}&quantity=${quantity}`;
    
    return this.http.put<ProductSize>(url, {}, { // Body rỗng nếu không cần thiết
        headers: this.headers,
    });
}
}
