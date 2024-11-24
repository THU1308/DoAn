package com.Website_Selling_Clother.service.Imp;

import com.Website_Selling_Clother.dto.OrderDTO;
import com.Website_Selling_Clother.dto.OrderDetailDTO;
import com.Website_Selling_Clother.entity.Product;
import com.Website_Selling_Clother.repository.ProductRepository;
import com.Website_Selling_Clother.service.ImgurService;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class EmailService {

    @Autowired
    JavaMailSender mailSender;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    ImgurService imgurService;

    public void sendOrderEmail(OrderDTO order) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // Đặt người nhận, chủ đề và nội dung email
            helper.setTo(order.getEmail());
            helper.setSubject("Chi tiết đơn hàng của bạn");
            helper.setText(generateOrderEmailBody(order), true);

            // Gửi email
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String generateOrderEmailBody(OrderDTO order) {
        StringBuilder body = new StringBuilder();
        body.append("<html><body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>");

        // Tiêu đề và lời chào
        body.append("<h2 style='color: #2c3e50;'>Cảm ơn bạn đã mua hàng tại eShop!</h2>");
        body.append("<h3 style='color: #16a085;'>Chi tiết đơn hàng:</h3>");

        // Bảng chi tiết đơn hàng
        body.append("<table border='1' style='border-collapse: collapse; width: 100%; margin-top: 20px; background-color: #ffffff;'>");
        body.append("<tr style='background-color: #34495e; color: white; text-align: left;'>")
                .append("<th style='padding: 10px;'>Tên sản phẩm</th>")
                .append("<th style='padding: 10px;'>Ảnh sản phẩm</th>")
                .append("<th style='padding: 10px;'>Số lượng</th>")
                .append("<th style='padding: 10px;'>Giá</th>")
                .append("<th style='padding: 10px;'>Tổng giá</th>")
                .append("</tr>");

        long totalOrderPrice = 0;
        List<CompletableFuture<String>> imageFutures = new ArrayList<>();
        List<Product> products = new ArrayList<>();

        // Duyệt qua các sản phẩm và tải ảnh lên Imgur
        for (OrderDetailDTO item : order.getOrderDetailDTOS()) {
            Product product = productRepository.findById(item.getProductId());
            if (product != null) {
                products.add(product);
                imageFutures.add(imgurService.uploadImageAsync(product.getImages().iterator().next().getData()));
            }
        }

        CompletableFuture.allOf(imageFutures.toArray(new CompletableFuture[0])).join();

        int index = 0;
        for (OrderDetailDTO item : order.getOrderDetailDTOS()) {
            Product product = products.get(index);
            String imageUrl = imageFutures.get(index++).join();
            long totalPrice = item.getPrice() * item.getQuantity();

            // Dòng sản phẩm trong bảng
            body.append("<tr style='border-bottom: 1px solid #ddd;'>")
                    .append("<td style='padding: 10px;'>").append(product.getName()).append("</td>")
                    .append("<td style='padding: 10px; text-align: center;'><img src='").append(imageUrl).append("' width='100' height='100'></td>")
                    .append("<td style='padding: 10px; text-align: center;'>").append(item.getQuantity()).append("</td>")
                    .append("<td style='padding: 10px; text-align: right;'>").append(String.format("%d", item.getPrice())).append(" VND</td>")
                    .append("<td style='padding: 10px; text-align: right;'>").append(String.format("%d", totalPrice)).append(" VND</td>")
                    .append("</tr>");
            totalOrderPrice += totalPrice;
        }

        body.append("</table>");

        // Tổng giá trị đơn hàng
        body.append("<br>")
                .append("<h4 style='color: #16a085;'>Tổng cộng: ").append(String.format("%d", totalOrderPrice)).append(" VND</h4>");

        // Thông điệp chúc mừng
        body.append("<br><p style='font-size: 16px; color: #2c3e50;'>Chúc bạn một ngày tốt lành!</p>");

        body.append("</body></html>");

        return body.toString();
    }
}
