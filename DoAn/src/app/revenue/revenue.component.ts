import { Component, OnInit } from '@angular/core';
import { OrderStatisticsDTO } from '../dto/order.statistics.dto';
import { RevenueByDateDTO } from '../dto/revenue.bydate.dto';
import { RevenueByMonthDTO } from '../dto/revenue.bymonth.dto';
import { RevenueByYearDTO } from '../dto/revenue.byyear.dto';
import { OrderStatisticsService } from '../services/statistic/statistic.service';
import { ChartType } from 'chart.js';


@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.scss']
})
export class RevenueComponent implements OnInit {
  orderStatistics: OrderStatisticsDTO | null = null;
  revenueByDate: RevenueByDateDTO[] = [];
  revenueByMonth: RevenueByMonthDTO[] = [];
  revenueByYear: RevenueByYearDTO[] = [];
  selectedOption: string = 'total'; // Giá trị mặc định

  // Biểu đồ
  public chartData: any = {
    labels: [],
    datasets: []
  };
  public chartType: ChartType = 'bar'; // Kiểu biểu đồ
  public chartOptions: any = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  constructor(private orderStatisticsService: OrderStatisticsService) {}

  ngOnInit(): void {
    this.loadOrderStatistics();
    this.loadRevenueByDate();
    this.loadRevenueByMonth();
    this.loadRevenueByYear();
  }

  loadOrderStatistics(): void {
    this.orderStatisticsService.getOrderStatistics().subscribe(data => {
      this.orderStatistics = data;
      this.updateChart('total'); // Cập nhật biểu đồ tổng doanh thu
    });
  }

  loadRevenueByDate(): void {
    this.orderStatisticsService.getRevenueByDate().subscribe(data => {
      this.revenueByDate = data;
      this.updateChart('daily'); // Cập nhật biểu đồ doanh thu theo ngày
    });
  }

  loadRevenueByMonth(): void {
    this.orderStatisticsService.getRevenueByMonth().subscribe(data => {
      this.revenueByMonth = data;
      this.updateChart('monthly'); // Cập nhật biểu đồ doanh thu theo tháng
    });
  }

  loadRevenueByYear(): void {
    this.orderStatisticsService.getRevenueByYear().subscribe(data => {
      this.revenueByYear = data;
      this.updateChart('yearly'); // Cập nhật biểu đồ doanh thu theo năm
    });
  }

  updateChart(option: string): void {
    switch (option) {
      case 'total':
        this.chartData = {
          labels: ['Total Orders'],
          datasets: [
            {
              label: 'Total Revenue',
              data: [this.orderStatistics ? this.orderStatistics.totalRevenue : 0],
              backgroundColor: 'rgba(0, 123, 255, 0.6)',
              borderColor: 'rgba(0, 123, 255, 1)',
              borderWidth: 1
            }
          ]
        };
        break;
      case 'daily':
        this.chartData.labels = this.revenueByDate.map(item => item.date);
        this.chartData.datasets = [
          {
            label: 'Revenue by Date',
            data: this.revenueByDate.map(item => item.totalRevenue),
            backgroundColor: 'rgba(40, 167, 69, 0.6)',
            borderColor: 'rgba(40, 167, 69, 1)',
            borderWidth: 1
          }
        ];
        break;
      case 'monthly':
        this.chartData.labels = this.revenueByMonth.map(item => `${item.month}/${item.year}`);
        this.chartData.datasets = [
          {
            label: 'Revenue by Month',
            data: this.revenueByMonth.map(item => item.totalRevenue),
            backgroundColor: 'rgba(255, 193, 7, 0.6)',
            borderColor: 'rgba(255, 193, 7, 1)',
            borderWidth: 1
          }
        ];
        break;
      case 'yearly':
        this.chartData.labels = this.revenueByYear.map(item => item.year);
        this.chartData.datasets = [
          {
            label: 'Revenue by Year',
            data: this.revenueByYear.map(item => item.totalRevenue),
            backgroundColor: 'rgba(255, 7, 7, 0.6)',
            borderColor: 'rgba(255, 7, 7, 1)',
            borderWidth: 1
          }
        ];
        break;
      default:
        break;
    }
  }

  onSelectChange(event: any): void {
    this.selectedOption = event.target.value; // Cập nhật giá trị lựa chọn
    this.updateChart(this.selectedOption); // Cập nhật biểu đồ theo lựa chọn
  }
}