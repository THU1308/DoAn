import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { enviroment } from 'src/app/enviroment/enviroment';
import { OrderDto } from 'src/app/dto/order.dto';

@Injectable({
    providedIn: 'root'  // This makes it available application-wide
  })
  
export class OrderService{
    constructor(private http: HttpClient) {}
    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    addOrder(orderDto: OrderDto): Observable<any> {
        const addOrderUrl = `${enviroment.apiBaseUrl}/order/create`;
        return this.http.post(addOrderUrl, orderDto, { headers: this.headers, observe: 'response' })
      }

      sendOrderToEmail(order: OrderDto): Observable<any> {
        const sendOrderToEmail = `${enviroment.apiBaseUrl}/email/sendOrderToEmail`;
        return this.http.post(sendOrderToEmail, order, { headers : this.headers });
      }
}