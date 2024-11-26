
import { ImageDto } from './image.dto';
import { SizeDto } from './size.dto';

export class ProductDetailDto {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  images: ImageDto[];
  imageIds: number[];
  sizeIds: number[];
  productSize : SizeDto[];
  isDeleted : boolean = false;


  //send to cart
  selectedSize?: any;
  productQuantity?: number = 1;

  constructor(
    id: number,
    name: string,
    description: string,
    price: number,
    categoryId: number,
    images: ImageDto[] = [],
    imageIds: number[] = [],
    sizeIds: number[] = [],
    productSize : SizeDto[] = [],
    isDeleted = false
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.categoryId = categoryId;
    this.images = images ? images : [];
    this.imageIds = imageIds;
    this.sizeIds = sizeIds;
    this.productSize = productSize;
    this.isDeleted = isDeleted;
  }
}
