import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { OrderService } from '../services/order/order.service';
import { Order } from '../dto/order.admin.dto';


@Component({
  selector: 'app-admin-order',
  templateUrl: './admin-order.component.html',
  styleUrls: ['./admin-order.component.scss'],
})
export class AdminOrderComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchTerm: string = '';
  filterStatus: string = '';

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // Các thuộc tính phân trang
  currentPage: number = 1; // Trang hiện tại
  itemsPerPage: number = 8; // Số mục hiển thị mỗi trang

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        debugger;
        this.orders = data;
        this.filteredOrders = [...this.orders];
      },
      error: (err) => this.showSnackBar('Failed to load orders!'),
    });
  }

  applyFilters(): void {
    this.filteredOrders = this.orders.filter((order) => {
      debugger;
      const matchesSearch =
        `${order.firstName} ${order.lastName} ${order.email} ${order.phone}`
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.filterStatus
        ? order.payment_status === this.filterStatus
        : true;

      return matchesSearch && matchesStatus;
    });
  }

  editPaymentStatus(order: Order): void {
    this.orderService.updatePaymentStatus(order.id, order.payment_status).subscribe({
      next: (updatedOrder) => {
        order.payment_status = updatedOrder.payment_status; // Cập nhật trạng thái của order
        this.loadOrders()
        this.showSnackBar('Payment status updated!');
      },
      error: () => this.showSnackBar('Failed to update payment status!'),
    });
  }
  

  deleteOrder(orderId: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(orderId).subscribe({
        next: () => {
          this.orders = this.orders.filter((order) => order.id !== orderId);
          this.filteredOrders = this.filteredOrders.filter(
            (order) => order.id !== orderId,
          );
          this.showSnackBar('Order deleted successfully!');
        },
        error: () => this.showSnackBar('Failed to delete order!'),
      });
    }
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
