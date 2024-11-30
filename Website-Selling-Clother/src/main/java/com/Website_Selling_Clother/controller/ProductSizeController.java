package com.Website_Selling_Clother.controller;

import com.Website_Selling_Clother.entity.ProductSize;
import com.Website_Selling_Clother.service.Imp.ProductSizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/inventory")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductSizeController {
    @Autowired
    private ProductSizeService productSizeService;

    // Lấy tồn kho theo sản phẩm
    @GetMapping("/{productId}")
    public ResponseEntity<?> getStockByProduct(@PathVariable int productId) {
        try {
            List<ProductSize> stock = productSizeService.getStockByProduct(productId);
            return ResponseEntity.ok(stock);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Cập nhật số lượng tồn kho
    @PutMapping("/update")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_EMPLOYEE')")
    public ResponseEntity<?> updateStock(
            @RequestParam int productId,
            @RequestParam int sizeId,
            @RequestParam int quantity) {
        try {
            ProductSize updatedStock = productSizeService.updateStock(productId, sizeId, quantity);
            return ResponseEntity.ok(updatedStock);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Thống kê tổng số lượng tồn kho
    @GetMapping("/total")
    public ResponseEntity<?> getTotalStock() {
        try {
            Integer totalStock = productSizeService.getTotalStock();
            return ResponseEntity.ok(totalStock);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Lấy danh sách sản phẩm gần hết hàng
    @GetMapping("/low-stock")
    public ResponseEntity<?> getLowStockProducts(@RequestParam int threshold) {
        try {
            List<ProductSize> lowStockProducts = productSizeService.getLowStockProducts(threshold);
            return ResponseEntity.ok(lowStockProducts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

