package com.Website_Selling_Clother.service.Imp;

import com.Website_Selling_Clother.dto.ProductDTO;
import com.Website_Selling_Clother.entity.Category;
import com.Website_Selling_Clother.entity.Image;
import com.Website_Selling_Clother.entity.Product;
import com.Website_Selling_Clother.exception.DataNotFoundException;
import com.Website_Selling_Clother.repository.*;
import com.Website_Selling_Clother.service.IProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ProductService implements IProductService {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ImageRepository imageRepository;

    @Override
    public List<Product> getList() {
        return productRepository.findAll(Sort.by("id").descending());
    }

    @Override
    public List<Product> getListNewst(int number) {
        return productRepository.getListNewest(number);
    }

    @Override
    public List<Product> getListByPrice() {
        return productRepository.getListByPrice();
    }

    @Override
    public List<Product> findRelatedProduct(int id) {
        return productRepository.findRelatedProduct(id);
    }

    @Override
    public List<Product> getListProductByCategory(int id) {
        return productRepository.getListProductByCategory(id);
    }

    @Override
    public List<Product> getListByPriceRange(int id, int min, int max) {
        return productRepository.getListProductByPriceRange(id,min,max);
    }

    @Override
    public Page<Product> searchProduct(String keyword,PageRequest pageRequest) {
        return productRepository.searchProduct(keyword,pageRequest);
    }

    @Override
    public Product getProduct(int id) throws DataNotFoundException {
        return productRepository.findById(id).orElseThrow(() -> new DataNotFoundException("Không tìm thấy product với id: " + id));
    }

    @Override
    public Product createProduct(ProductDTO productDTO) throws DataNotFoundException {
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        Category category = categoryRepository.findById(productDTO.getCategoryId()).orElseThrow(()-> new DataNotFoundException("Không tìm thấy category với id: " + productDTO.getCategoryId()));
        product.setCategory(category);

        if(!productDTO.getImageIds().isEmpty()){
            Set<Image> images = new HashSet<>();
            for(int imageId: productDTO.getImageIds()){
                Image image = imageRepository.findById(imageId).orElseThrow(() -> new DataNotFoundException("Không tìm thấy image id: " + imageId));
                images.add(image);
            }
                product.setImages(images);
        }
        productRepository.save(product);
        return product;
    }

    @Override
    public Product updateProduct(int id, ProductDTO productDTO) throws DataNotFoundException {
        Product product= productRepository.findById(id).orElseThrow(() -> new DataNotFoundException("Không tìm thấy product id: " + id));
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        Category category = categoryRepository.findById(productDTO.getCategoryId()).orElseThrow(()-> new DataNotFoundException("Không tìm thấy category với id: " + productDTO.getCategoryId()));
        product.setCategory(category);

        if(!productDTO.getImageIds().isEmpty()){
            Set<Image> images = new HashSet<>();
            for(int imageId: productDTO.getImageIds()){
                Image image = imageRepository.findById(imageId).orElseThrow(() -> new DataNotFoundException("Không tìm thấy image id: " + imageId));
                images.add(image);
            }
            product.setImages(images);
        }

        productRepository.save(product);
        return product;
    }

    @Override
    public void deleteProduct(int id) throws DataNotFoundException {
        Product product= productRepository.findById(id).orElseThrow(() -> new DataNotFoundException("Không tìm thấy product id: " + id));
        productRepository.delete(product);
    }

    @Override
    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    @Override
    public Page<Product> getProductByCategoryId(int categoryId ,PageRequest pageRequest) {
        Page<Product> productPage;
        productPage = productRepository.getListProductByCategory(categoryId,pageRequest);
        return productPage;
    }

    @Override
    public List<Image> getListImageById(int id){
        return productRepository.getListImages(id);
    }

    @Override
    public List<Product> findAllByCategoryId(int categoryId) {
        return productRepository.findAllByCategoryId(categoryId);
    }

    @Override
    public List<Product> findByPriceBetween(Double minPrice, Double maxPrice){
        return  productRepository.findByPriceBetween(minPrice,maxPrice);
    }

    @Override
    public List<Product> findAllByOrderByPriceAsc(){
        return productRepository.findAllByOrderByPriceAsc();
    }

    @Override
    public List<Product> findAllByOrderByPriceDesc(){
        return  productRepository.findAllByOrderByPriceDesc();
    }

    @Override
    public List<Product> findByName(String name){
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    public List<Image> getListImageByProductId(int productId) {
        List<Object[]> results = productRepository.findImagesByProductId(productId);
        List<Image> images = new ArrayList<>();

        for (Object[] row : results) {
            Image image = new Image();
            image.setId((Integer) row[0]);
            image.setName((String) row[1]);
            image.setType((String) row[2]);
            image.setSize((Long) row[3]);
            image.setData((byte[]) row[4]);

            images.add(image);
        }

        return images;
    }

}
