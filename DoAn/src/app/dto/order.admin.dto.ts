export interface Order {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    totalPrice: number;
    paymentStatus: string;
    enable: boolean;
    createdAt: Date;
  }
  