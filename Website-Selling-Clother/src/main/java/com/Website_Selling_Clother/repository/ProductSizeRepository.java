package com.Website_Selling_Clother.repository;

import com.Website_Selling_Clother.entity.ProductSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface ProductSizeRepository extends JpaRepository<ProductSize,Integer> {
    @Query("SELECT ps.size.id FROM ProductSize ps WHERE ps.product.id = :productId")
    Set<Integer> findSizeIdsByProductId(@Param("productId") int productId);

    // Lấy danh sách tồn kho theo ID sản phẩm
    List<ProductSize> findByProductId(int productId);

    // Lấy số lượng tồn kho theo sản phẩm và size
    @Query("SELECT ps FROM ProductSize ps WHERE ps.product.id = :productId AND ps.size.id = :sizeId")
    ProductSize getQuantity(@Param("productId") int productId, @Param("sizeId") int sizeId);

    // Thống kê tổng số lượng tồn kho
    @Query("SELECT SUM(ps.quantity) FROM ProductSize ps")
    Integer getTotalStock();

    // Danh sách sản phẩm có số lượng dưới ngưỡng
    @Query("SELECT ps FROM ProductSize ps WHERE ps.quantity < :threshold")
    List<ProductSize> findLowStockProducts(@Param("threshold") int threshold);

}
