import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryDto } from 'src/app/dto/category.dto';
import { ProductDto } from 'src/app/dto/product.dto';
import { CategoryService } from 'src/app/services/category/category.service';
import { ProductService } from 'src/app/services/product/product.service';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { FormControl } from '@angular/forms';
import { ShoppingCartService } from 'src/app/services/cart/cart.service';
import { ProductDetailDto } from 'src/app/dto/product.detail.dto';
import { ImageService } from 'src/app/services/image/image.service';
import { ImageDto } from 'src/app/dto/image.dto';
import { SizeDto } from 'src/app/dto/size.dto';
import { SizeService } from 'src/app/services/size/size.service';
import { TokenService } from 'src/app/services/token.service';
import { InventoryService } from 'src/app/services/inventory/Inventory.service';
import { ProductSize } from 'src/app/dto/product-size.dto';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  showNotification: boolean = false;
  isLoading: boolean = false;
  message: string = '';
  notification(message: string) {
    this.showNotification = true;
    this.message = message;
    this.timeoutNotification(2000);
  }

  listProduct: ProductDetailDto[] = [];
  images: ImageDto[] = [];
  currentPage = 1; // Start with page 1
  productsPerPage = 12; // Display 12 products per page
  totalPages = 0; // Total number of pages
  displayedProducts: ProductDetailDto[] = []; // Array to hold displayed products
  listCategory: CategoryDto[] = [];

  // filter variable
  selectedCategory: CategoryDto | null = null;
  selectedPriceRange: string | null = null;

  private displayedProductsSubject = new Subject<ProductDto[]>();
  displayedProducts$ = this.displayedProductsSubject.asObservable();

  //search
  suggestions$: Observable<any>;
  searchControl = new FormControl();
  showSuggestions = false;

  // Model variables
  showProductDetailsModel = false;
  selectedProduct: ProductDetailDto | null = null;
  sizes: SizeDto[] = [];
  selectedSize: any;
  productQuantity: number = 1;
  isModalOpen: boolean = false; // Trạng thái modal

  // Hàm mở modal
  openModal(product: ProductDetailDto): void {
    this.selectedProduct = product;
    this.selectedSize = null;
    //this.selectedColor = null;
    this.getSize(product);
    this.productQuantity = 1;

    this.isModalOpen = true
  }

  // Hàm đóng modal
  closeModal(): void {
    this.isModalOpen = false; // Đóng modal
  }

  onFocus(): void {
    this.showSuggestions = true;
  }

  onBlur(): void {
    // Ẩn danh sách gợi ý khi mất focus
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200); // Thêm delay để sự kiện click diễn ra trước khi ẩn
  }

  constructor(
    private productService: ProductService,
    public router: Router,
    private route: ActivatedRoute,
    private catergoryService: CategoryService,
    private changeDetectorRef: ChangeDetectorRef,
    private cartService: ShoppingCartService,
    private imageService: ImageService,
    private sizeService: SizeService,
    private tokenService: TokenService,
    private inventoryService: InventoryService
  ) {
    debugger
    this.cartService.updateCartStore()
    this.cartService.loadUserCart()
    this.suggestions$ = this.searchControl.valueChanges.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      switchMap((value) => {
        if (value && value.trim() !== '') {
          // Chỉ gọi API khi có giá trị
          this.showSuggestions = true;
          return this.productService.getSuggestions(value);
        } else {
          this.showSuggestions = false; // Ẩn gợi ý nếu không có giá trị
          return of([]); // Trả về mảng rỗng nếu không có giá trị
        }
      }),
    );

  }

  ngOnInit(): void {
    this.isLoading = true;
    this.getListProducts();
    this.isLoading = true;
    this.getCategories();
    //this.showNotification= true
  }

  async getListProducts() {
    this.route.queryParams.subscribe((params) => {
      this.currentPage = parseInt(params['page'], 10) || 1;
    });

    try {
      debugger
      const response = await this.productService.getListNewest().toPromise();
      this.listProduct = response.data;
      debugger
      if (this.listProduct) {
        // Chờ tất cả lời gọi API lấy ảnh cho từng sản phẩm
        await Promise.all(
          this.listProduct.map(async (product) => {
            if (!Array.isArray(product.images)) {
              product.images = [];
            }
            if (!Array.isArray(product.productSize)) {
              product.productSize = [];
            }
            await this.getImages(product);
            await this.getSize(product);

          }),
        );
      }

      // Cập nhật sản phẩm hiển thị
      this.totalPages = Math.ceil(
        this.listProduct.length / this.productsPerPage,
      );
      this.updateDisplayedProducts();
      this.isLoading = false;
    } catch (error) {
      console.log(error);
      this.isLoading = false;
    }
  }

  getImages(productDetailDto: ProductDetailDto): Promise<void> {
    return new Promise((resolve, reject) => {
      this.imageService.getListImgById(productDetailDto.imageIds[0]).subscribe({
        next: (response: any) => {

          if (response && Array.isArray(response)) {
            debugger
            productDetailDto.images = response;
          } else if (response) {
            debugger
            productDetailDto.images = [response];
          }
          resolve(); // Hoàn thành Promise khi ảnh được gán
        },
        error: (error: any) => {
          console.log(error);
          reject(error); // Lỗi nếu không lấy được ảnh
        },
      });
    });
  }

  getCategories() {
    this.catergoryService.getListCategory().subscribe({
      next: (response: any) => {
        //debugger
        this.listCategory = response.data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.log(error);
        this.isLoading = false;
      },
    });
  }

  filterByCategory() {
    this.isLoading = true;
    this.productService
      .getProductByCategoryId(this.selectedCategory!.id)
      .subscribe({
        next: (response: any) => {
          //debugger;
          this.listProduct = response.data;
          this.updateDisplayedProducts();
          this.changeDetectorRef.detectChanges();
          this.isLoading = false;
        },
        error: (error: any) => {
          console.log(error);
          this.isLoading = false;
        },
      });
  }

  filterByPriceRange(minPrice: number, maxPrice: number) {
    this.isLoading = true;
    this.productService.getProductsByPriceRange(minPrice, maxPrice).subscribe({
      next: (response: any) => {
        debugger;
        this.listProduct = response.data;
        this.updateDisplayedProducts();
        this.changeDetectorRef.detectChanges();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.log(error);
        this.isLoading = false;
      },
    });
  }
  //filter on category
  onCategoryChange(category: CategoryDto) {
    this.selectedCategory = category;
    this.filterByCategory();
  }

  //filter on price range
  onPriceRangeChange(priceRange: string) {
    //this.selectedPriceRange = priceRange;
    this.filterByPriceRange(
      parseFloat(priceRange.split('-')[0]),
      parseFloat(priceRange.split('-')[1]),
    );
  }

  //sort by price
  sortType: string = '';
  onSortChange(sortType: string) {
    if (sortType === 'Low To High') {
      this.isLoading = true;
      this.listProduct = this.listProduct.sort((a, b) => a.price - b.price);
      this.isLoading = false;
      this.updateDisplayedProducts();
      this.changeDetectorRef.detectChanges();
    }

    if (sortType === 'High To Low') {
      this.isLoading = true;
      this.listProduct = this.listProduct.sort((a, b) => b.price - a.price);
      this.isLoading = false;
      this.updateDisplayedProducts();
      this.changeDetectorRef.detectChanges();
    }

    // debugger
    // this.productService.sortProductsByPrice(this.sortTypeOrder).subscribe({
    //   next: (response: any) => {
    //     debugger
    //     this.listProduct = response.data;
    //     this.updateDisplayedProducts();
    //     this.changeDetectorRef.detectChanges();
    //     this.isLoading = false;
    //   },
    //   error: (error: any) => {
    //     this.isLoading = false;
    //     console.log(error);
    //   },
    // });
  }

  //Cart
  timeoutNotification(milisecon: number) {
    setTimeout(() => {
      this.showNotification = false;
    }, milisecon);
  }

  setMessageNotification(message: string) {
    this.message = message;
  }
  sizesInventory: ProductSize[] = [];


  async checkInventory(productId: any): Promise<boolean> {
    if (this.selectedProduct != null) {
      try {
        const response: any = await this.inventoryService.getStockByProduct(productId).toPromise();
        this.sizesInventory = response;
        debugger
        for (let i = 0; i < this.sizesInventory.length; i++) {
          if (this.sizesInventory[i].size.id == this.selectedSize.id) {
            if (this.sizesInventory[i].quantity == 0) {
              this.notification("Sản phẩm này size " + this.selectedProduct?.selectedSize.name + " đã hết hàng");
              return false;
            }

            if (this.sizesInventory[i].quantity < this.productQuantity) {
              this.notification("Sản phẩm này size " + this.selectedProduct?.selectedSize.name + " không đủ số lượng. Số lượng tồn: " + this.sizesInventory[i].quantity);
              return false;
            }
          }
        }

        return true;
      } catch (error) {
        console.log("Error checking inventory:", error);
        return false;
      }
    }
    return true;
  }


  async addToCart(product: ProductDetailDto) {
    console.log(product);
    if (!this.tokenService.getToken()) {
      this.notification('Vui lòng đăng nhập để thực hiện mua hàng');
      return;
    }

    if (!this.selectedSize) {
      this.notification('Vui lòng chọn kích thước cho sản phẩm');
      return;
    }

    product.productQuantity = this.productQuantity;
    product.selectedSize = this.selectedSize

    const isAvailable = await this.checkInventory(this.selectedProduct?.id);
    if (!isAvailable) {
      return;
    }
    const existingItem = await this.cartService.getCartItemById(product.id, this.selectedProduct?.selectedSize.name);

    if (existingItem != null) {
      this.showNotification = true;
      this.setMessageNotification('Sản phẩm đã có trong giỏ hàng');
      this.timeoutNotification(2000);
      return;
    }

    // Gắn size đã chọn và số lượng vào sản phẩm
    product.productQuantity = this.productQuantity;
    product.selectedSize = this.selectedSize

    // Kiểm tra xem images có phải là mảng không và khởi tạo nếu cần
    if (!Array.isArray(product.images)) {
      product.images = [];
    }

    // Gắn ảnh vào sản phẩm từ mảng images (chỉ lấy ảnh đầu tiên nếu có)
    if (this.images.length > 0) {
      product.images[0] = this.images[0]; // Gán ảnh đầu tiên vào thuộc tính productImg của sản phẩm
    }

    // Thêm sản phẩm vào giỏ hàng
    this.cartService.addToCart(product, this.selectedProduct?.selectedSize.name);
    this.showNotification = true;
    this.setMessageNotification('Thêm sản phẩm vào giỏ hàng thành công');
    this.timeoutNotification(2000);
  }

  // // Function to close the product details model
  // closeProductDetailsModel() {
  //   this.showProductDetailsModel = false;
  //   this.selectedProduct = null;
  //   this.selectedSize = null;
  //   this.productQuantity = 1;
  // }

  // Function to get sizes for the selected product
  getSize(product: ProductDetailDto) {
    this.sizeService.getSizeOfProduct(product.id).subscribe({
      next: (response: any) => {
        //this.sizes = response.data;
        if (product != null) {
          if (!Array.isArray(product.productSize)) {
            product.productSize = [];
          }
          product.productSize = response.data;
          console.log("sizesdad: " + product.productSize[0].name)
        }
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  // Function to update the selected size
  onSizeChange(size: any) {
    this.selectedSize = size;
  }

  // Function to update the quantity
  updateQuantity(event: any) {
    this.productQuantity = +event.target.value;
  }

  // Function to add the product to the cart

  updateDisplayedProducts() {
    this.totalPages = Math.ceil(this.listProduct.length / this.productsPerPage);
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    this.displayedProducts = this.listProduct.slice(startIndex, endIndex);
    this.displayedProductsSubject.next(this.displayedProducts);
  }

  public viewDetail(id: number) {
    this.router.navigate(['/product', id]);
  }

  // Pagination methods
  goToPage(page: number) {
    this.currentPage = page;
    this.updateDisplayedProducts();
    this.router.navigate(['/shop'], {
      queryParams: { page: this.currentPage },
    }); // Update URL
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
