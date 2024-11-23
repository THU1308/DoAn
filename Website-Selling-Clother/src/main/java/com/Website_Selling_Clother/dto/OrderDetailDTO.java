package com.Website_Selling_Clother.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailDTO {

    private int productId;

    private long price;

    private int quantity;

    private long subTotal;

    private int sizeId;
}
