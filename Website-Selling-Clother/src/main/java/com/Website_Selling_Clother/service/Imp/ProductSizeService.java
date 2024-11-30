package com.Website_Selling_Clother.service.Imp;

import com.Website_Selling_Clother.entity.ProductSize;
import com.Website_Selling_Clother.repository.ProductSizeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductSizeService {

    @Autowired
    private ProductSizeRepository productSizeRepository;

    // Lấy danh sách tồn kho theo sản phẩm
    public List<ProductSize> getStockByProduct(int productId) {
        return productSizeRepository.findByProductId(productId);
    }

    // Cập nhật số lượng tồn kho
    public ProductSize updateStock(int productId, int sizeId, int quantity) {
        ProductSize productSize = productSizeRepository.getQuantity(productId, sizeId);
        if (productSize == null) {
            throw new RuntimeException("Không tìm thấy tồn kho cho sản phẩm và size tương ứng.");
        }
        productSize.setQuantity(quantity);
        return productSizeRepository.save(productSize);
    }

    // Thống kê tổng số lượng tồn kho
    public Integer getTotalStock() {
        return productSizeRepository.getTotalStock();
    }

    // Lấy danh sách sản phẩm gần hết hàng
    public List<ProductSize> getLowStockProducts(int threshold) {
        return productSizeRepository.findLowStockProducts(threshold);
    }
}

