export interface ProductSize {
    id: number;
    product: {
      id: number;
      name: string;
    };
    size: {
      id: number;
      name: string;
    };
    quantity: number;
  }
  