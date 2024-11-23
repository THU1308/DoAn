package com.Website_Selling_Clother.response;

import com.Website_Selling_Clother.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
public class OrderDetailResponse {

    private Product product;

    private int quantity;
}
