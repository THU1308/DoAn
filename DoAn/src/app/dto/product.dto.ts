import { CartDto } from './cart.dto';
import { CategoryDto } from './category.dto';
import { ImageDto } from './image.dto';

export class ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  category?: CategoryDto;
  images: ImageDto[];

   //send to cart
   selectedSize?: any;
   productQuantity?: any = 1;

  constructor(
    id: number,
    name: string,
    description: string,
    price: number,
    category: CategoryDto,
    images: ImageDto[],
    selectedSize : any,
    productQuantity : any,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.images = images;
    this.selectedSize = selectedSize;
    this.productQuantity = productQuantity;
  }
}
