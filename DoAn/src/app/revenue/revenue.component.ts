import { Component, OnInit } from '@angular/core';
import { OrderStatisticsDTO } from '../dto/order.statistics.dto';
import { RevenueByDateDTO } from '../dto/revenue.bydate.dto';
import { RevenueByMonthDTO } from '../dto/revenue.bymonth.dto';
import { RevenueByYearDTO } from '../dto/revenue.byyear.dto';
import { OrderStatisticsService } from '../services/statistic/statistic.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  ChartType,
  Chart,
  LinearScale,
  CategoryScale,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement // Thêm PointElement
} from 'chart.js'; // Thêm các thành phần cần thiết cho biểu đồ đường

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.scss'],
})
export class RevenueComponent implements OnInit {
  orderStatistics: OrderStatisticsDTO | null = null;
  revenueByDate: RevenueByDateDTO[] = [];
  revenueByMonth: RevenueByMonthDTO[] = [];
  revenueByYear: RevenueByYearDTO[] = [];
  selectedOption: string = 'total'; // Giá trị mặc định

  itemsPerPage: number = 4; // Số mục hiển thị mỗi trang
  currentPage: number = 1; // Trang hiện tại


  // Biểu đồ
  public chartData: any = {
    labels: [],
    datasets: [],
  };
  public chartType: ChartType = 'bar'; // Kiểu biểu đồ mặc định là biểu đồ cột
  public chartOptions: any = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Thời gian', // Tiêu đề cho trục X
        },
      },
      y: {
        type: 'linear',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Doanh thu (VNĐ)', // Tiêu đề cho trục Y
        },
      },
    },
  };

  constructor(private orderStatisticsService: OrderStatisticsService) {
    // Đăng ký các thang đo, controller và element
    Chart.register(LinearScale, CategoryScale, BarController, BarElement, LineController, LineElement, PointElement); // Đăng ký PointElement
  }

  ngOnInit(): void {
    this.loadOrderStatistics();
    this.loadRevenueByDate();
    this.loadRevenueByMonth();
    this.loadRevenueByYear();
  }

  loadOrderStatistics(): void {
    this.orderStatisticsService.getOrderStatistics().subscribe((data) => {
      this.orderStatistics = data;
      this.updateChart('total'); // Cập nhật biểu đồ tổng doanh thu
    });
  }

  loadRevenueByDate(): void {
    this.orderStatisticsService.getRevenueByDate().subscribe((data) => {
      this.revenueByDate = data;

      // Gộp doanh thu cho các ngày trùng nhau
      const revenueMap: { [key: string]: RevenueByDateDTO } = {};
      this.revenueByDate.forEach((item) => {
        const date = new Date(item.date); // Chuyển đổi chuỗi ngày ISO thành đối tượng Date

        if (!isNaN(date.getTime())) {
          const formattedDate = date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });

          if (!revenueMap[formattedDate]) {
            revenueMap[formattedDate] = {
              date: formattedDate,
              totalRevenue: 0,
            };
          }
          revenueMap[formattedDate].totalRevenue += item.totalRevenue;
        } else {
          console.warn(`Invalid date: ${item.date}`);
        }
      });

      // Chuyển đổi revenueMap về mảng
      this.revenueByDate = Object.values(revenueMap);
      this.updateChart('daily'); // Cập nhật biểu đồ doanh thu theo ngày
    });
  }

  loadRevenueByMonth(): void {
    this.orderStatisticsService.getRevenueByMonth().subscribe((data) => {
      this.revenueByMonth = data;
      this.updateChart('monthly'); // Cập nhật biểu đồ doanh thu theo tháng
    });
  }

  loadRevenueByYear(): void {
    this.orderStatisticsService.getRevenueByYear().subscribe((data) => {
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
              borderWidth: 1,
            },
          ],
        };
        this.chartType = 'bar'; // Sử dụng biểu đồ cột
        break;
      case 'daily':
        this.chartData.labels = this.revenueByDate.map(item => item.date); // Sử dụng date đã định dạng
        this.chartData.datasets = [
          {
            label: 'Revenue by Date',
            data: this.revenueByDate.map(item => item.totalRevenue),
            backgroundColor: 'rgba(40, 167, 69, 0.6)',
            borderColor: 'rgba(40, 167, 69, 1)',
            borderWidth: 1,
          },
        ];
        this.chartType = 'line'; // Sử dụng biểu đồ đường
        break;
      case 'monthly':
        this.chartData.labels = this.revenueByMonth.map(
          (item) => `${item.month}/${item.year}`,
        );
        this.chartData.datasets = [
          {
            label: 'Revenue by Month',
            data: this.revenueByMonth.map((item) => item.totalRevenue),
            backgroundColor: 'rgba(255, 193, 7, 0.6)',
            borderColor: 'rgba(255, 193, 7, 1)',
            borderWidth: 1,
          },
        ];
        this.chartType = 'bar'; // Sử dụng biểu đồ cột
        break;
      case 'yearly':
        this.chartData.labels = this.revenueByYear.map((item) => item.year);
        this.chartData.datasets = [
          {
            label: 'Revenue by Year',
            data: this.revenueByYear.map((item) => item.totalRevenue),
            backgroundColor: 'rgba(255, 7, 7, 0.6)',
            borderColor: 'rgba(255, 7, 7, 1)',
            borderWidth: 1,
          },
        ];
        this.chartType = 'bar'; // Sử dụng biểu đồ cột
        break;
      default:
        break;
    }
  }

  onSelectChange(event: any): void {
    this.selectedOption = event.target.value; // Cập nhật giá trị lựa chọn
    this.updateChart(this.selectedOption); // Cập nhật biểu đồ theo lựa chọn
  }

  exportToExcel(data: any[], fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data); // Chuyển đổi dữ liệu sang sheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new(); // Tạo workbook mới
    XLSX.utils.book_append_sheet(wb, ws, 'Data'); // Thêm sheet vào workbook

    // Xuất file
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, `${fileName}.xlsx`);
  }
}
 