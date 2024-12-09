import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { ActivatedRoute } from '@angular/router';
import { ProductDetailDto } from '../../dto/product.detail.dto';
import { ImageService } from '../../services/image/image.service';
import { ImageDto } from '../../dto/image.dto';
import { VndCurrencyPipe } from '../../vnd-currency.pipe';
import { SizeDto } from 'src/app/dto/size.dto';
import { SizeService } from 'src/app/services/size/size.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { ProductDto } from 'src/app/dto/product.dto';
import { ShoppingCartService } from 'src/app/services/cart/cart.service';
import { InventoryService } from 'src/app/services/inventory/Inventory.service';
import { ProductSize } from 'src/app/dto/product-size.dto';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  vndCurrencyPipe = new VndCurrencyPipe();
  product: ProductDetailDto | null = null;
  images: ImageDto[] = [];
  sizes: SizeDto[] = [];
  selectedSize: any;
  showNotification: boolean = false;
  isLoading: boolean = false;
  message: string = '';
  notification(message: string) {
    this.showNotification = true;
    this.message = message;
    this.timeoutNotification(2000);
  }

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private imageService: ImageService,
    private sizeService: SizeService,
    private catergoryService: CategoryService,
    private cartService: ShoppingCartService,
    private inventoryService: InventoryService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.getProduct();
    //this.cartService.clearCart();
  }

  getProduct() {
    this.route.paramMap.subscribe((params) => {
      //debugger;
      const productId = +params.get('id')!;
      this.productService.getProductById(productId).subscribe(
        (response: any) => {
          debugger;
          this.product = response.data;
          this.getSize(productId);
          if (this.product != null) {
            this.getImages(this.product);
          }
          this.isLoading = false;
        },
        (error: any) => {
          console.log(error);
          this.isLoading = false;
        },
      );
    });
  }

  getImages(productDetailDto: ProductDetailDto): Promise<void> {
    return new Promise((resolve, reject) => {
      this.productService
        .getListImageByProductId(productDetailDto.id)
        .subscribe({
          next: (response: any) => {
            //debugger;
            if (!Array.isArray(productDetailDto.images)) {
              productDetailDto.images = [];
            }
            productDetailDto.images = response.data;
            //console.log(productDetailDto.images.length)
            resolve(); // Hoàn thành Promise khi ảnh được gán
          },
          error: (error: any) => {
            console.log(error);
            reject(error); // Lỗi nếu không lấy được ảnh
          },
        });
    });
  }

  getSize(id: number): void {
    this.sizeService.getSizeOfProduct(id).subscribe({
      next: (response: any) => {
        //debugger;
        //this.sizes = response.data;
        if (this.product != null) {
          if (!Array.isArray(this.product.productSize)) {
            this.product.productSize = [];
          }
          this.product.productSize = response.data;
          console.log("sizesdad: " + this.product.productSize[0].name)
        }
        //alert(this.sizes.length)
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  toggleSize(size: any): void {
    this.selectedSize = size;
  }

  productQuantity: number = 1;
  updateQuantity(event: any): void {
    this.productQuantity = +event.target.value;
  }

  activeImageIndex: number = 0;
  setActiveImage(index: number): void {
    this.activeImageIndex = index;
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

  listCategory: any[] = [];

  async fetchCategories(): Promise<void> {
    try {
      const response = await this.catergoryService
        .getListCategory()
        .toPromise();
      this.listCategory = response.data;
    } catch (error) {
      console.error(error);
    }
  }

  // toProductDto(productDetail: ProductDetailDto): ProductDto {
  //   this.fetchCategories();

  //   return new ProductDto(
  //     productDetail.id,
  //     productDetail.name,
  //     productDetail.description,
  //     productDetail.price,
  //     this.listCategory.filter((x) => x.id === productDetail.categoryId)[0],
  //     productDetail.images ? this.images : [],
  //   );
  // }

  sizesInventory: ProductSize[] = [];
  async checkInventory(product: ProductDetailDto): Promise<boolean> {
    if (product != null) {
      try {
        const response: any = await this.inventoryService.getStockByProduct(product.id).toPromise();
        this.sizesInventory = response;
        debugger
        for (let i = 0; i < this.sizesInventory.length; i++) {
          if (this.sizesInventory[i].size.id == this.selectedSize.id) {
            if (this.sizesInventory[i].quantity == 0) {
              this.notification("Sản phẩm này size " + product?.selectedSize.name + " đã hết hàng");
              return false;
            }

            if (this.sizesInventory[i].quantity < this.productQuantity) {
              this.notification("Sản phẩm này size " + this.product?.selectedSize.name + " không đủ số lượng. Số lượng tồn: " + this.sizesInventory[i].quantity);
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
    // Kiểm tra nếu người dùng chưa chọn size
    if (!this.selectedSize) {
      this.showNotification = true;
      this.setMessageNotification('Vui lòng chọn kích thước cho sản phẩm');
      this.timeoutNotification(2000);
      return;
    }

    const existingItem = await this.cartService.getCartItemById(product.id, this.selectedSize.name);
    if (existingItem != null) {
      this.showNotification = true;
      this.setMessageNotification('Sản phẩm đã có trong giỏ hàng');
      this.timeoutNotification(2000);
      return;
    }

    // Gắn size đã chọn và số lượng vào sản phẩm
    product.selectedSize = this.selectedSize;
    product.productQuantity = this.productQuantity;



    // Kiểm tra xem images có phải là mảng không và khởi tạo nếu cần
    if (!Array.isArray(product.images)) {
      product.images = [];
    }

    // Gắn ảnh vào sản phẩm từ mảng images (chỉ lấy ảnh đầu tiên nếu có)
    if (this.images.length > 0) {
      product.images[0] = this.images[0];
    }

    const isAvailable = await this.checkInventory(product);
    if (!isAvailable) {
      return;
    }

    // Thêm sản phẩm vào giỏ hàng
    this.cartService.addToCart(product, this.selectedSize.name);
    this.showNotification = true;
    this.setMessageNotification('Thêm sản phẩm vào giỏ hàng thành công');
    this.timeoutNotification(2000);
  }
}
