import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product/product.service';
import { CategoryService } from '../services/category/category.service';
import { CategoryDto } from '../dto/category.dto';
import { ProductDetailDto } from '../dto/product.detail.dto';
import { TokenService } from '../services/token.service';
import { SizeDto } from '../dto/size.dto';
import { SizeService } from '../services/size/size.service';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss']
})
export class AdminProductComponent {
  showNotification: boolean = false;
  isLoading: boolean = false;
  message: string = '';

    // Các thuộc tính phân trang
    currentPage: number = 1; // Trang hiện tại
    itemsPerPage: number = 8; // Số mục hiển thị mỗi trang

  timeoutNotification(milisecon: number) {
    setTimeout(() => {
      this.showNotification = false;
    }, milisecon);
  }

  notification(message: string) {
    this.showNotification = true;
    this.message = message;
    this.timeoutNotification(2000);
  }

  products: ProductDetailDto[] = [];
  categories: CategoryDto[] = [];
  sizes: SizeDto[] = [];
  productForm!: FormGroup;
  editing: boolean = false;
  editingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private tokenService : TokenService,
    private sizeService : SizeService
  ) {}

  ngOnInit(): void {
    this.tokenService.getToken()
    this.initForm();
    this.loadProducts();
    this.loadCategories();
    this.loadSizes()
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      imageIds: [],           
      sizeIds: [[], Validators.required]                
    });
  }
  onFileSelected(event: any) {
    // Lấy các file đã chọn từ input
    const files: FileList = event.target.files;
    if (files) {
      // Cập nhật danh sách các file đã chọn
      this.selectedImages = Array.from(files);
    }
  }
  selectedImages: File[] = [];


  loadProducts() {
    this.isLoading = true;
    this.productService.getListProduct().subscribe({
      next: (data) => {
        console.log('Products data:', data.data); // Check what you're receiving here
        this.products = Array.isArray(data.data) ? data.data : []; // Ensure it's an array
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.notification('Lỗi khi tải danh sách sản phẩm.');
      }
    });
  }
  
  loadCategories() {
    this.categoryService.getListCategory().subscribe({
      next: (data) => {
        console.log('Categories data:', data.data); // Check what you're receiving here
        this.categories = Array.isArray(data.data) ? data.data : []; // Ensure it's an array
      },
      error: (err) => {
        console.error(err);
        this.notification('Lỗi khi tải danh mục.');
      }
    });
  }

  loadSizes() {
    this.sizeService.getListSize().subscribe({
      next: (data) => {
        debugger
        console.log('Categories data:', data.data); // Check what you're receiving here
        this.sizes = Array.isArray(data.data) ? data.data : []; // Ensure it's an array
        debugger
      },
      error: (err) => {
        console.error(err);
        this.notification('Lỗi khi tải danh mục.');
      }
    });
  }
  

  saveProduct() {
    if (this.productForm.invalid || this.selectedImages.length === 0) {
      return; // Nếu form không hợp lệ hoặc chưa chọn ảnh, không thực hiện
    }
  
    this.isLoading = true;
    const productData = this.productForm.value;
  
    // Gọi API upload ảnh
    this.productService.uploadFiles(this.selectedImages).subscribe({
      next: (response: any) => {
        debugger
        
        // Nếu response có thuộc tính 'images' chứa mảng các ảnh
        const imageIds = Array.isArray(response.data) ? response.data.map((image: any) => image.id) : [];
  
        const productWithImageIds = {
          ...productData,
          imageIds: imageIds // Gán mảng imageIds vào thông tin sản phẩm
        };
  
        if (this.editing) {
          // Cập nhật sản phẩm
          this.productService.updateProduct(this.editingId!, productWithImageIds).subscribe({
            
            next: () => {
              debugger
              this.loadProducts();
              this.cancelEdit();
              this.notification('Cập nhật sản phẩm thành công!');
              this.productForm.clearValidators
            },
            error: (err) => {
              console.error(err);
              this.isLoading = false;
              this.notification('Cập nhật sản phẩm thất bại!');
            }
          });
        } else {
          // Thêm mới sản phẩm
          this.productService.addProduct(productWithImageIds).subscribe({
            next: () => {
              this.loadProducts();
              this.productForm.reset();
              this.selectedImages = []; // Reset lại ảnh đã chọn
              this.notification('Thêm mới sản phẩm thành công!');
            },
            error: (err) => {
              console.error(err);
              this.isLoading = false;
              this.notification('Thêm mới sản phẩm thất bại!');
            }
          });
        }
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.notification('Lỗi khi lưu ảnh!');
      }
    });
  }
  
  // Component.ts
selectedSizes: number[] = []; // Danh sách kích thước đã chọn

onSizeSelected(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const sizeId = parseInt(checkbox.value, 10);

    if (checkbox.checked) {
        // Thêm vào danh sách nếu được chọn
        this.selectedSizes.push(sizeId);
    } else {
        // Loại bỏ khỏi danh sách nếu bị bỏ chọn
        this.selectedSizes = this.selectedSizes.filter(id => id !== sizeId);
    }

    // Đồng bộ giá trị với FormControl nếu cần
    this.productForm.controls['sizeIds'].setValue(this.selectedSizes);
}

  

  editProduct(product: ProductDetailDto) {
    this.editing = true;
    this.editingId = product.id;
    this.productForm.patchValue(product);
  }

  deleteProduct(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.isLoading = true;
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
          this.notification('Xóa sản phẩm thành công!');
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
          this.notification('Xóa sản phẩm thất bại!');
        }
      });
    }
  }

  cancelEdit() {
    this.editing = false;
    this.editingId = null;
    this.productForm.reset();
  }

}
