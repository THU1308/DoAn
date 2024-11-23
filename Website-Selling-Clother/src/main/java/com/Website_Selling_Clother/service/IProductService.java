package com.Website_Selling_Clother.service;

import com.Website_Selling_Clother.dto.ProductDTO;
import com.Website_Selling_Clother.entity.Image;
import com.Website_Selling_Clother.entity.Product;
import com.Website_Selling_Clother.entity.Size;
import com.Website_Selling_Clother.exception.DataNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IProductService {
    List<Product> getList();

    List<Product> getListNewst(int number);

    List<Product> getListByPrice();

    List<Product> findRelatedProduct(int id);

    List<Product> getListProductByCategory(int id);

    List<Product> getListByPriceRange(int id,int min, int max);

    Page<Product> searchProduct(String keyword,PageRequest pageRequest);

    Product getProduct(int id) throws DataNotFoundException;

    Product createProduct(ProductDTO productDTO) throws DataNotFoundException;

    Product updateProduct(int id, ProductDTO productDTO) throws DataNotFoundException;

    void deleteProduct(int id) throws DataNotFoundException;

    Page<Product> getAllProducts(Pageable pageable);

    Page<Product> getProductByCategoryId(int categoryId,PageRequest pageRequest);

    List<Image> getListImageById(int id);
    List<Product> findAllByCategoryId(int categoryId);
    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);
    List<Product> findAllByOrderByPriceAsc();
    List<Product> findAllByOrderByPriceDesc();
    List<Product> findByName(String name);
    List<Image> getListImageByProductId(int productId);
}
