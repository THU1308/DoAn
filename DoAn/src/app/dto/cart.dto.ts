import { SizeDto } from "./size.dto";

export interface CartDto{
    productId : number ;
    productName: string ;
    productPrice : number;
    productQuantity : any;
    productSize : SizeDto ;
    productImg : any;
    selectedSize?: any;
    totalPriceOfItem?: number;
  }
