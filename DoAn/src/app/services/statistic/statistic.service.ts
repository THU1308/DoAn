// src/app/services/order-statistics.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderStatisticsDTO } from 'src/app/dto/order.statistics.dto';
import { RevenueByDateDTO } from 'src/app/dto/revenue.bydate.dto';
import { RevenueByMonthDTO } from 'src/app/dto/revenue.bymonth.dto';
import { RevenueByYearDTO } from 'src/app/dto/revenue.byyear.dto';


@Injectable({
  providedIn: 'root'
})
export class OrderStatisticsService {
  private apiUrl = 'http://localhost:8088/api/v1/statistics'; // Thay đổi URL nếu cần

  constructor(private http: HttpClient) {}

  getOrderStatistics(): Observable<OrderStatisticsDTO> {
    return this.http.get<OrderStatisticsDTO>(`${this.apiUrl}/orders`);
  }

  getRevenueByDate(): Observable<RevenueByDateDTO[]> {
    return this.http.get<RevenueByDateDTO[]>(`${this.apiUrl}/revenue/date`);
  }

  getRevenueByMonth(): Observable<RevenueByMonthDTO[]> {
    return this.http.get<RevenueByMonthDTO[]>(`${this.apiUrl}/revenue/month`);
  }

  getRevenueByYear(): Observable<RevenueByYearDTO[]> {
    return this.http.get<RevenueByYearDTO[]>(`${this.apiUrl}/revenue/year`);
  }
}
