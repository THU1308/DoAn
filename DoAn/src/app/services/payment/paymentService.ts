// src/app/services/payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  

  constructor(private http: HttpClient) {}

  createPayment(totalAmount: number): Observable<any> {
    const apiUrl = 'http://localhost:8088/api/v1/api/vnpay/create';
    // Thực hiện request GET với query params
    const params = new HttpParams().set('totalAmount', totalAmount.toString());
    return this.http.get(apiUrl, { params });
  }

  // Phương thức xác minh kết quả thanh toán
  verifyPayment(queryParams: any): Observable<any> {
    const apiUrl = 'http://localhost:8088/api/v1/vnpay_return';
    // Use POST for security
    return this.http.get(apiUrl, queryParams);
  }
}
