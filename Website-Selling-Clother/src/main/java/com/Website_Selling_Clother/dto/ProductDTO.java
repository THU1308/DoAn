package com.Website_Selling_Clother.dto;

import com.Website_Selling_Clother.entity.Image;
import com.Website_Selling_Clother.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private int id;
    private String name;
    private String description;
    private long price;
    private int categoryId;
    private Set<Integer> imageIds;
    private Set<Integer> sizeIds;
    private int isDeleted;


    public static ProductDTO fromProduct(Product product){
        ProductDTO productDTO = new ProductDTO();
        productDTO.setId(product.getId());
        productDTO.setName(product.getName());
        productDTO.setPrice(product.getPrice());
        productDTO.setCategoryId(product.getCategory().getId());
        productDTO.setDescription(product.getDescription());
        productDTO.setIsDeleted(product.getIsDeleted());
        if(!product.getImages().isEmpty()){
            productDTO.setImageIds(product.getImages().stream()
                    .map(Image::getId)
                    .collect(Collectors.toSet()));
        }
        return productDTO;
    }
}
