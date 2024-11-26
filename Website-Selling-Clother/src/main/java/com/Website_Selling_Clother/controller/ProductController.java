package com.Website_Selling_Clother.controller;

import com.Website_Selling_Clother.controller.response.ResponseData;
import com.Website_Selling_Clother.dto.ProductDTO;
import com.Website_Selling_Clother.entity.Image;
import com.Website_Selling_Clother.entity.Product;
import com.Website_Selling_Clother.entity.ProductSize;
import com.Website_Selling_Clother.entity.Size;
import com.Website_Selling_Clother.repository.ProductSizeRepository;
import com.Website_Selling_Clother.repository.SizeRepository;
import com.Website_Selling_Clother.request.ProductSizeRequest;
import com.Website_Selling_Clother.response.ProductCategoryResponse;
import com.Website_Selling_Clother.response.ProductKeywordResponse;
import com.Website_Selling_Clother.response.ProductListResponse;
import com.Website_Selling_Clother.service.Imp.ProductService;
import com.Website_Selling_Clother.service.Imp.SizeService;
import io.jsonwebtoken.lang.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("${api.prefix}/product")
public class ProductController {

    @Autowired
    ProductService productService;

    @Autowired
    ProductSizeRepository productSizeRepository;

    @Autowired
    SizeRepository sizeRepository;


    @GetMapping("")
    public ResponseData<List<ProductDTO>> getAllProduct() {
        List<Product> productList = productService.getList();
        List<ProductDTO> productDTOList = new ArrayList<>();
        for(Product product : productList){
            productDTOList.add(ProductDTO.fromProduct(product));
        }
        return new ResponseData<>(HttpStatus.OK, "Success", productDTOList);
    }

    @GetMapping("/limit")
    public ResponseEntity<?> getProducts(
            @RequestParam("page")     int page,
            @RequestParam("limit")    int limit
    ) {
        PageRequest pageRequest = PageRequest.of(
                page, limit,
                Sort.by("id").descending());
        Page<Product> productPage = productService.getAllProducts(pageRequest);
        // Lấy tổng số trang
        int totalPages = productPage.getTotalPages();
        List<Product> products = productPage.getContent();
        return ResponseEntity.ok(ProductListResponse
                .builder()
                .products(products)
                .totalPages(totalPages)
                .build());
    }

    @GetMapping("image")
    public ResponseData<List<Image>> getListImageByProductId(int productId){
        return new ResponseData<>(HttpStatus.OK,"Success",productService.getListImageByProductId(productId));
    }

//    @GetMapping("/category")
//    public ResponseEntity<?> getProductByCategoryId(
//            @RequestParam("categoryId") int categoryId,
//            @RequestParam("page")     int page,
//            @RequestParam("limit")    int limit,
//            @RequestParam("sort")    String sort
//    ) {
//        PageRequest pageRequest;
//        if(sort.equals("priceHight")){
//            pageRequest = PageRequest.of(
//                    page, limit,
//                    Sort.by("price").ascending());
//        }
//        else if(sort.equals("idHight")){
//            pageRequest = PageRequest.of(
//                    page, limit,
//                    Sort.by("id").ascending());
//        }
//        else {
//            pageRequest = PageRequest.of(
//                    page, limit,
//                    Sort.by(sort).descending());
//        }
//        Page<Product> productPage = productService.getProductByCategoryId(categoryId,pageRequest);
//        int totalPages = productPage.getTotalPages();
//        List<Product> products = productPage.getContent();
//        return ResponseEntity.ok(ProductCategoryResponse
//                .builder()
//                .categoryId(categoryId)
//                .products(products)
//                .totalPages(totalPages)
//                .build());
//    }


    @GetMapping("/{id}")
    public ResponseData<ProductDTO> getProductById(@PathVariable int id) {
        try {
            // Lấy thông tin sản phẩm theo ID
            Product product = productService.getProduct(id);
            ProductDTO productDTO = ProductDTO.fromProduct(product);

            // Lấy danh sách sizeIds cho sản phẩm này từ repository
            Set<Integer> sizeIds = productSizeRepository.findSizeIdsByProductId(product.getId());

            // Cập nhật sizeIds vào DTO
            productDTO.setSizeIds(sizeIds);

            return new ResponseData<>(HttpStatus.OK, "Success", productDTO);
        } catch (Exception e) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST, "Bad request");
        }
    }


    @GetMapping("/listnew/{number}")
    public ResponseData<List<ProductDTO>> getListNewest(@PathVariable int number) {
        // Lấy danh sách sản phẩm mới nhất, đã lọc is_deleted = false
        List<Product> list = productService.getListNewst(number);
        List<ProductDTO> productDTOList = new ArrayList<>();

        // Lặp qua các sản phẩm để tạo DTO cho từng sản phẩm
        for (var item : list) {
            ProductDTO productDTO = ProductDTO.fromProduct(item);

            // Lấy danh sách ProductSize cho sản phẩm hiện tại
            Set<Integer> sizeIds = productSizeRepository.findSizeIdsByProductId(item.getId());

            // Cập nhật danh sách sizeIds vào DTO
            productDTO.setSizeIds(sizeIds);
            productDTOList.add(productDTO);
        }

        return new ResponseData<>(HttpStatus.OK, "Success", productDTOList);
    }


//    @GetMapping("/price")
//    public ResponseEntity<?> getListByPrice(){
//        List<Product> list =productService.getListByPrice();
//        List<ProductDTO> productDTOList = new ArrayList<>();
//        for (var item:list) {
//            ProductDTO productDTO = ProductDTO.fromProduct(item);
//            Set<Integer> sizeIds = new HashSet<>();
//            for (var item1: productSizeRepository.findAll()) {
//                if(item1.getProduct().getId() == productDTO.getId()){
//                    sizeIds.add(item1.getSize().getId());
//                }
//            }
//            productDTO.setSizeIds(sizeIds);
//            productDTOList.add(productDTO);
//        }
//        return ResponseEntity.ok(productDTOList);
//    }

//    @GetMapping("/related/{id}")
//    public ResponseEntity<?> getListRelatedProduct(@PathVariable int id){
//        List<Product> list = productService.findRelatedProduct(id);
//        List<ProductDTO> productDTOList = new ArrayList<>();
//        for (var item:list) {
//            ProductDTO productDTO = ProductDTO.fromProduct(item);
//            productDTOList.add(productDTO);
//        }
//        return ResponseEntity.ok(productDTOList);
//    }

    @GetMapping("/category/{id}")
    public ResponseData<List<Product>> getListProductByCategory(@PathVariable int id) {
        List<Product> list = productService.findAllByCategoryId(id);
        return new ResponseData<>(HttpStatus.OK, "Success", list);
    }

    @GetMapping("/price-range")
    public ResponseData<List<Product>> filterByPrice(@RequestParam double minPrice, @RequestParam double maxPrice) {
        return new ResponseData<>(HttpStatus.OK, "Success", productService.findByPriceBetween(minPrice, maxPrice));
    }

    @GetMapping("/sort")
    public ResponseData<List<Product>> sort(@RequestParam String sortType) {
        if (Objects.equals(sortType, "ASC")) {
            return new ResponseData<>(HttpStatus.OK, "Success", productService.findAllByOrderByPriceAsc());

        }
        if(Objects.equals(sortType,"DESC")){
            return new ResponseData<>(HttpStatus.OK, "Success", productService.findAllByOrderByPriceDesc());
        }
        return new ResponseData<>(HttpStatus.BAD_REQUEST,"Sort Fail");
    }

    @GetMapping("/search")
    public List<Product> searchProductsByName(@RequestParam String name) {
        return productService.findByName(name);
    }

    @PostMapping("")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_EMPLOYEE')")
    public ResponseEntity<?> createProduct(@RequestBody ProductDTO productDTO) {
        try {
            Product product = productService.createProduct(productDTO);
            if (product.getCategory().getId() != 3) {
                for (int i = 1; i <= 4; i++) {
                    ProductSize productSize = new ProductSize();
                    productSize.setProduct(product);
                    Size size = sizeRepository.findById(i).orElseThrow();
                    productSize.setSize(size);
                    productSize.setQuantity((Integer) ProductSize.getRandomQuantity(20, 300));
                    productSizeRepository.save(productSize);
                }
            } else {
                ProductSize productSize = new ProductSize();
                productSize.setProduct(product);
                Size size = sizeRepository.findById(5).orElseThrow();
                productSize.setSize(size);
                productSize.setQuantity((Integer) ProductSize.getRandomQuantity(20, 300));
                productSizeRepository.save(productSize);
            }
            return ResponseEntity.ok(ProductDTO.fromProduct(product));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_EMPLOYEE')")
    public ResponseEntity<?> updateProduct(@PathVariable int id, @RequestBody ProductDTO productDTO) {
        try {
            Product product = productService.updateProduct(id, productDTO);
            return ResponseEntity.ok(ProductDTO.fromProduct(product));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable int id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok("Xóa sản phẩm thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/quantity")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_EMPLOYEE')")
    public ResponseEntity<?> updateProductSizeQuantity(@RequestBody ProductSizeRequest productSizeRequest) {
        try {
            ProductSize productSize = productSizeRepository.getQuantity(productSizeRequest.getProductId(), productSizeRequest.getSizeId());
            productSize.setQuantity(productSizeRequest.getQuantity());
            productSizeRepository.save(productSize);
            return ResponseEntity.ok(productSize);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/quantity")
    public ResponseEntity<?> getQuantity() {
        try {
            List<ProductSize> productSize = productSizeRepository.findAll();
            return ResponseEntity.ok(productSize);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/numPorduct")
    public ResponseEntity<?> getQuantity(
            @RequestParam("productId") int productId,
            @RequestParam("sizeId") int sizeId
    ) {
        try {
            int quantity = productSizeRepository.getQuantity(productId, sizeId).getQuantity();
            return ResponseEntity.ok(quantity);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
