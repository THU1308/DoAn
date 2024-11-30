import { Component, OnInit } from '@angular/core';
import { ProductSize } from 'src/app/dto/product-size.dto';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProductService } from '../services/product/product.service';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { InventoryService } from '../services/inventory/Inventory.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-inventory',
  templateUrl: './admin-inventory.component.html',
  styleUrls: ['./admin-inventory.component.scss'],
})
export class AdminInventoryComponent implements OnInit {
  productSizes: ProductSize[] = [];
  lowStockThreshold: number = 10; // Ngưỡng sản phẩm sắp hết hàng
  totalStock: number = 0;
  selectedProductId: number | null = null; // ID sản phẩm được chọn
  searchQuery: string = ''; // Từ khóa tìm kiếm sản phẩm
  products: any[] = []; // Danh sách sản phẩm tìm kiếm
  searchSubject: Subject<string> = new Subject<string>(); // Subject cho tìm kiếm

   // Phân trang
   // Các thuộc tính phân trang
  currentPage: number = 1; // Trang hiện tại
  itemsPerPage: number = 4; // Số mục hiển thị mỗi trang


  showNotification: boolean = false;
  isLoading: boolean = false;
  message: string = '';

  constructor(
    private inventoryService: InventoryService,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.loadTotalStock();
    this.loadLowStockProducts();

    // Đăng ký lắng nghe subject tìm kiếm
    this.searchSubject.pipe(
      debounceTime(300),
      switchMap(query => this.productService.getSuggestions(query))
    ).subscribe(
      data => {
        this.products = data; // Cập nhật danh sách sản phẩm tìm kiếm
      },
      error => {
        console.error('Error searching products:', error);
      }
    );
  }

  // Lấy tổng số lượng sản phẩm trong kho
  loadTotalStock(): void {
    this.inventoryService.getTotalStock().subscribe(
      (total: any) => {
        this.totalStock = total;
      },
      (error: any) => {
        console.error('Error fetching total stock:', error);
      }
    );
  }

  // Lấy danh sách sản phẩm gần hết hàng
  loadLowStockProducts(): void {
    this.isLoading = true;
    this.inventoryService.getLowStockProducts(this.lowStockThreshold).subscribe(
      (data: any) => {
        this.productSizes = data;
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error fetching low stock products:', error);
        this.isLoading = false;
      }
    );
  }

  // Phương thức tìm kiếm sản phẩm
  searchProducts(query: string): void {
    this.searchSubject.next(query); // Gửi giá trị tìm kiếm vào subject
  }

  // Lựa chọn sản phẩm từ danh sách tìm kiếm
  selectProduct(productId: number): void {
    this.selectedProductId = productId; // Cập nhật ID sản phẩm được chọn
    this.loadStockByProduct(); // Gọi hàm tải tồn kho cho sản phẩm đã chọn
    this.products = []; // Xóa danh sách sản phẩm tìm kiếm
    this.searchQuery = ''; // Xóa từ khóa tìm kiếm
  }

  // Tải tồn kho theo sản phẩm
  loadStockByProduct(): void {
    if (!this.selectedProductId) {
      this.snackBar.open('Vui lòng chọn sản phẩm để xem tồn kho', 'OK', {
        duration: 3000,
      });
      return;
    }
    this.isLoading = true;
    this.inventoryService.getStockByProduct(this.selectedProductId).subscribe(
      (data: any) => {
        this.productSizes = data;
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error fetching stock by product:', error);
        this.isLoading = false;
      }
    );
  }

  // Cập nhật số lượng sản phẩm theo size
  updateStock(productId: number, sizeId: number, newQuantity: number): void {
    this.isLoading =true;
    console.log('Product ID:', productId);
    console.log('Size ID:', sizeId);
    console.log('New Quantity:', newQuantity);

    if (!productId || !sizeId || newQuantity < 0) {
      this.snackBar.open('Vui lòng chọn số lượng tồn kho hợp lệ!', 'OK', {
        duration: 3000,
      });
      this.isLoading = false;
      return;
    }

    this.inventoryService.updateStock(productId, sizeId, newQuantity).subscribe(
      (updatedStock: any) => {
        console.log('Updated stock:', updatedStock);
        this.isLoading = false;
        this.snackBar.open('Cập nhật tồn kho thành công!', 'OK', {
          duration: 3000,
        });

        // Cập nhật số lượng của sản phẩm cụ thể trong productSizes
        const index = this.productSizes.findIndex(
          ps => ps.product.id === productId && ps.size.id === sizeId
        );

        if (index !== -1) {
          this.productSizes[index].quantity = newQuantity; // Cập nhật số lượng mới
        }
        this.loadTotalStock()
      },
      (error: any) => {
        console.error('Error updating stock:', error);
        this.isLoading = false;
        this.snackBar.open('Cập nhật tồn kho thất bại!', 'OK', {
          duration: 3000,
        });
      }
    );
  }

  goBack(): void {
    this.selectedProductId = null; // Đặt ID sản phẩm đã chọn về null
    this.loadLowStockProducts(); // Tải lại danh sách sản phẩm tồn kho thấp
    this.products = []; // Xóa danh sách sản phẩm tìm kiếm
    this.searchQuery = ''; // Xóa từ khóa tìm kiếm
  }
}
