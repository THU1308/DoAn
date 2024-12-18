import { OrderDetailDto } from "./order-details.dto";
export interface OrderDto {
    id?: number;
    firstName?: string;
    lastName: string;
    country: string;
    address: string;
    town: string;
    state: string;
    postCode: number;
    email: string;
    note: string;
    phone: string;
    username: string;
    totalPrice: number;
    paymentStatus: string;
    orderDetailDTOS: OrderDetailDto[];
  }