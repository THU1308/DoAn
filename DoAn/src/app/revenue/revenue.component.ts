import { Component, OnInit } from '@angular/core';
import { OrderStatisticsDTO } from '../dto/order.statistics.dto';
import { RevenueByDateDTO } from '../dto/revenue.bydate.dto';
import { RevenueByMonthDTO } from '../dto/revenue.bymonth.dto';
import { RevenueByYearDTO } from '../dto/revenue.byyear.dto';
import { OrderStatisticsService } from '../services/statistic/statistic.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ChartType,
  
} from 'chart.js'; // Thêm các thành phần cần thiết cho biểu đồ đường
import { Chart, registerables, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

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
  startDate!: Date; // Ngày bắt đầu
  endDate!: Date; // Ngày kết thúc
  paymentStatus: string = 'completed'; // Trạng thái thanh toán

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

  constructor(
    private orderStatisticsService: OrderStatisticsService,
    private snackBar: MatSnackBar
  ) {
    // Đăng ký các thang đo, controller và element
    Chart.register(...registerables, ArcElement, Tooltip, Legend,ChartDataLabels); 
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

  // BY DATE

  getOrderStatisticsByDate(start: Date, end: Date): void {
    this.orderStatisticsService.getOrderStatisticsBetween(start, end).subscribe(
      (data) => {
        this.orderStatistics = data;
        this.updateChart('total');
      },
      (error) => {
        this.snackBar.open('Đã xảy ra lỗi khi lấy doanh thu ', 'Đóng', {
          duration: 3000,
        });
      }
    );
  }

  private getRevenueByDate(start: Date, end: Date): void {
    this.orderStatisticsService.getRevenueByDateBetween(start, end).subscribe(
      (data: RevenueByDateDTO[]) => {
        this.revenueByDate = []; // Đặt lại revenueByDate trước khi cập nhật
        const revenueMap: { [key: string]: RevenueByDateDTO } = {};

        data.forEach((item) => {
          const date = new Date(item.date); // Chuyển đổi chuỗi ngày ISO thành đối tượng Date

          if (!isNaN(date.getTime())) {
            const formattedDate = date.toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            });

            // Kiểm tra xem ngày đã được gán trong revenueMap chưa
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
      },
      (error) => {
        this.snackBar.open(
          'Đã xảy ra lỗi khi lấy doanh thu theo ngày ',
          'Đóng',
          {
            duration: 3000,
          }
        );
      }
    );
  }

  private getRevenueByMonth(start: Date, end: Date): void {
    this.orderStatisticsService.getRevenueByMonthBetween(start, end).subscribe(
      (data) => {
        this.revenueByMonth = data;
        this.updateChart('monthly'); // Cập nhật biểu đồ doanh thu theo tháng
      },
      (error) => {
        this.snackBar.open('Đã xảy ra lỗi khi lấy doanh theo tháng ', 'Đóng', {
          duration: 3000,
        });
      }
    );
  }

  private getRevenueByYear(start: Date, end: Date): void {
    this.orderStatisticsService.getRevenueByYearBetween(start, end).subscribe(
      (data) => {
        this.revenueByYear = data;
        this.updateChart('yearly'); // Cập nhật biểu đồ doanh thu theo năm
      },
      (error) => {
        this.snackBar.open(
          'Đã xảy ra lỗi khi lấy doanh thu theo năm ',
          'Đóng',
          {
            duration: 3000,
          }
        );
      }
    );
  }

  // Phương thức để lấy dữ liệu theo khoảng thời gian
  getStatistics(): void {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        this.getOrderStatisticsByDate(start, end);
        this.getRevenueByDate(start, end);
        this.getRevenueByMonth(start, end);
        this.getRevenueByYear(start, end);
      } else {
        this.snackBar.open(
          'Vui lòng chọn ngày bắt đầu và ngày kết thúc hợp lệ ',
          'Đóng',
          {
            duration: 3000,
          }
        );
      }
    } else {
      this.snackBar.open(
        'Vui lòng chọn ngày bắt đầu và ngày hết thúc ',
        'Đóng',
        {
          duration: 3000,
        }
      );
    }
  }


  exportToExcel(data: any[], fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data); // Chuyển đổi dữ liệu sang sheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new(); // Tạo workbook mới
    XLSX.utils.book_append_sheet(wb, ws, 'Data'); // Thêm sheet vào workbook

    // Xuất file
    const excelBuffer: any = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
    });
    const dataBlob: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    saveAs(dataBlob, `${fileName}.xlsx`);
  }

  updateChart(option: string): void {
    switch (option) {
      case 'total':
        this.chartData = {
          labels: ['Total Orders'],
          datasets: [
            {
              label: 'Total Revenue',
              data: [
                this.orderStatistics ? this.orderStatistics.totalRevenue : 0,
              ],
              backgroundColor: 'rgba(0, 123, 255, 0.6)',
              borderColor: 'rgba(0, 123, 255, 1)',
              borderWidth: 1,
            },
          ],
        };
        this.chartType = 'bar'; // Sử dụng biểu đồ cột
        break;
      case 'daily':
        this.chartData.labels = this.revenueByDate.map((item) => item.date); // Sử dụng date đã định dạng
        this.chartData.datasets = [
          {
            label: 'Revenue by Date',
            data: this.revenueByDate.map((item) => item.totalRevenue),
            backgroundColor: 'rgba(40, 167, 69, 0.6)',
            borderColor: 'rgba(40, 167, 69, 1)',
            borderWidth: 1,
          },
        ];
        this.chartType = 'line'; // Sử dụng biểu đồ đường
        break;
      case 'monthly':
        this.chartData.labels = this.revenueByMonth.map(
          (item) => `${item.month}/${item.year}`
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
        case 'compare':
        this.getCompareData();
        this.renderCombinedChart(this.compareData);
        break;
      default:
        break;
    }
  }

  resetFilters() {
    this.loadOrderStatistics();
    this.loadRevenueByDate();
    this.loadRevenueByMonth();
    this.loadRevenueByYear();
    this.startDate = new Date(); // Reset to current date
    this.endDate = new Date(); // Reset to current date
  }

  onSelectChange(event: any): void {
    this.selectedOption = event.target.value; // Cập nhật giá trị lựa chọn
    this.updateChart(this.selectedOption); // Cập nhật biểu đồ theo lựa chọn

    if (this.selectedOption === 'compare') {
      this.getCompareData(); // Lấy dữ liệu để so sánh
  }
  }

  compareData: RevenueByMonthDTO[] = []; // Dữ liệu cho biểu đồ so sánh

  getCompareData(): void {
    // Lấy dữ liệu để so sánh
    this.loadRevenueByMonth();
    debugger
    this.compareData = this.revenueByMonth;
  }

  renderCombinedChart(revenueByMonth: any[]): void {
    const combinedCanvas = document.getElementById('combinedChart') as HTMLCanvasElement;
    const combinedCtx = combinedCanvas ? combinedCanvas.getContext('2d') : null;

    if (combinedCtx) {
        const labels = revenueByMonth.map(item => `${item.month}/${item.year}`);
        const revenueData = revenueByMonth.map(item => item.totalRevenue);

        const totalRevenue = revenueData.reduce((acc, val) => acc + val, 0);

        new Chart(combinedCtx, {
            type: 'pie', // Loại biểu đồ
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Tỷ lệ doanh thu theo tháng',
                        data: revenueData,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                            'rgba(255, 159, 64, 0.6)',
                        ],
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Tỷ lệ doanh thu theo tháng',
                    },
                    datalabels: {
                        color: '#fff',
                        formatter: (value: number, ctx) => {
                          // Lấy dữ liệu từ dataset
                          const data = ctx.dataset.data || []; // Đảm bảo dữ liệu không phải null/undefined
                          // Loại bỏ giá trị không phải số
                          const filteredData = data.filter((val): val is number => typeof val === 'number');
                          // Tính tổng doanh thu
                          const total = filteredData.reduce((sum, val) => sum + val, 0);
                      
                          // Nếu tổng bằng 0, trả về "0%"
                          if (total === 0) return '0%';
                      
                          // Tính phần trăm
                          const percentage = ((value / total) * 100).toFixed(2);
                          return `${percentage}%`;
                      },                      
                        font: {
                            weight: 'bold',
                        },
                    },
                },
            },
            plugins: [ChartDataLabels], // Sử dụng plugin DataLabels
        });
    } else {
        console.error('Không thể tìm thấy canvas combinedChart');
    }
}

}

