export interface OrderDetailDto {
  productId: number;
  price: number;
  quantity: number;
  subTotal: number;
  sizeId: number | null; // Update type to allow null
}
