package com.Website_Selling_Clother.repository;

import com.Website_Selling_Clother.entity.ProductSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface ProductSizeRepository extends JpaRepository<ProductSize,Integer> {

    @Query(value ="Select * from product_size where product_id = :productId and size_id = :sizeId",nativeQuery = true)
    ProductSize getQuantity(int productId,int sizeId);

    @Query("SELECT ps.size.id FROM ProductSize ps WHERE ps.product.id = :productId")
    Set<Integer> findSizeIdsByProductId(@Param("productId") int productId);

}
