import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { enviroment } from 'src/app/enviroment/enviroment';
import { OrderDto } from 'src/app/dto/order.dto';

@Injectable({
  providedIn: 'root', // This makes it available application-wide
})
export class OrderService {
  constructor(private http: HttpClient) {}
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  addOrder(orderDto: OrderDto): Observable<any> {
    const addOrderUrl = `${enviroment.apiBaseUrl}/order/create`;
    return this.http.post(addOrderUrl, orderDto, {
      headers: this.headers,
      observe: 'response',
    });
  }

  sendOrderToEmail(order: OrderDto): Observable<any> {
    const sendOrderToEmail = `${enviroment.apiBaseUrl}/email/sendOrderToEmail`;
    return this.http.post(sendOrderToEmail, order, { headers: this.headers });
  }

  private apiUrl = 'http://localhost:8088/api/v1/orders';

  // Lấy tất cả đơn hàng
  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Cập nhật trạng thái thanh toán
  updatePaymentStatus(orderId: number, status: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/${orderId}/payment-status?status=${status}`,
      {},
    );
  }

  // Xóa mềm đơn hàng
  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${orderId}`);
  }
}
