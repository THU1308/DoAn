package com.Website_Selling_Clother.repository;

import com.Website_Selling_Clother.entity.Image;
import com.Website_Selling_Clother.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product,Integer> {
    @Query(value = "SELECT * FROM Product WHERE is_deleted = false ORDER BY id DESC LIMIT :number", nativeQuery = true)
    List<Product> getListNewest(int number);

    @Query(value = "Select * from Product WHERE is_deleted = false order by price desc limit 8 ",nativeQuery = true)
    List<Product> getListByPrice();

    @Query(value ="Select * from Product WHERE is_deleted = false where category_id = :id order by rand() limit 4",nativeQuery = true)
    List<Product> findRelatedProduct(int id);

    @Query(value ="Select * from Product WHERE is_deleted = false where category_id = :id",nativeQuery = true)
    List<Product> getListProductByCategory(int id);

    @Query(value = "Select * from Product WHERE is_deleted = false and category_id = :id and price between :min and :max",nativeQuery = true)
    List<Product> getListProductByPriceRange(int id,int min,int max);

    @Query(value= "Select * from Product WHERE is_deleted = false and name like %:keyword%",nativeQuery = true)
    Page<Product> searchProduct(String keyword,Pageable pageable);

    Page<Product>  findAll(Pageable pageable);

    @Query(value ="SELECT * FROM Product WHERE is_deleted = false and category_id = :categoryId",nativeQuery = true)
    Page<Product> getListProductByCategory(int categoryId,Pageable pageable);

    @Query(value = "SELECT * FROM product_image WHERE is_deleted = false and image_id =:id",nativeQuery = true)
    List<Image> getListImages(int id);

    List<Product> findAllByCategoryId(int id);
    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);
    List<Product> findAllByOrderByPriceAsc();
    List<Product> findAllByOrderByPriceDesc();
    List<Product> findByNameContainingIgnoreCase(String name);

    @Query(value = "SELECT i.id, i.name, i.type, i.size, i.data " +
            "FROM image i INNER JOIN product_image pi ON pi.image_id = i.id " +
            "WHERE pi.product_id = :productId AND pi.is_deleted = false", nativeQuery = true)
    List<Object[]> findImagesByProductId(@Param("productId") int productId);

    Product findById(int id);
}
