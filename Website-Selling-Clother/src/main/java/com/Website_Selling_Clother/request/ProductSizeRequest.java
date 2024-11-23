package com.Website_Selling_Clother.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductSizeRequest {
   private int productId;
   private int sizeId;
   private int quantity;
}
