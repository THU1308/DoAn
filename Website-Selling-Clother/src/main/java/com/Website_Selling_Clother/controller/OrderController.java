package com.Website_Selling_Clother.controller;

import com.Website_Selling_Clother.controller.response.ResponseData;
import com.Website_Selling_Clother.dto.OrderDTO;
import com.Website_Selling_Clother.entity.Order;
import com.Website_Selling_Clother.entity.OrderDetail;
import com.Website_Selling_Clother.exception.DataNotFoundException;
import com.Website_Selling_Clother.repository.OrderDetailRepository;
import com.Website_Selling_Clother.response.OrderDetailResponse;
import com.Website_Selling_Clother.service.Imp.EmailService;
import com.Website_Selling_Clother.service.Imp.OrderService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("${api.prefix}/order")
public class OrderController {

    @Autowired
    OrderService orderService;

    @Autowired
    OrderDetailRepository orderDetailRepository;

    @Autowired
    EmailService emailService;

    @GetMapping("")
    public ResponseEntity<List<Order>> getList() {
        List<Order> list = orderService.getAllListOrder();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/detail")
    public ResponseEntity<?> getListProductOrder() {
        List<OrderDetail> resultList = orderDetailRepository.findAll();
        List<OrderDetailResponse> responses = new ArrayList<>();
        for (var item : resultList) {
            OrderDetailResponse detailResponse = new OrderDetailResponse();
            detailResponse.setProduct(item.getProduct());
            detailResponse.setQuantity(item.getQuantity());
            responses.add(detailResponse);
        }
        Comparator<OrderDetailResponse> idComparator = new Comparator<OrderDetailResponse>() {
            @Override
            public int compare(OrderDetailResponse o1, OrderDetailResponse o2) {
                return Integer.compare(o1.getProduct().getId(), o2.getProduct().getId());
            }
        };
        Collections.sort(responses, idComparator);
        int count = 0;
        List<OrderDetailResponse> responses1 = new ArrayList<>();
        for (int i = 0; i < responses.size() - 2; i = i + count + 1) {
            OrderDetailResponse orderDetailResponse = responses.get(i);
            count = 0;
            for (int j = i + 1; j <= responses.size() - 1; j++) {
                if (orderDetailResponse.getProduct() == responses.get(j).getProduct()) {
                    orderDetailResponse.setQuantity(orderDetailResponse.getQuantity() + responses.get(j).getQuantity());
                    count++;
                }
            }
            responses1.add(orderDetailResponse);
        }
        Comparator<OrderDetailResponse> idComparator1 = new Comparator<OrderDetailResponse>() {
            @Override
            public int compare(OrderDetailResponse o1, OrderDetailResponse o2) {
                return Integer.compare(o2.getQuantity(), o1.getQuantity());
            }
        };
        Collections.sort(responses1, idComparator1);
        return ResponseEntity.ok(responses1);
    }

    @GetMapping("/revenue")
    public ResponseEntity<?> getRevenueByDateRange(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        Map<String, Long> revenueMap = orderService.getRevenueByDate(startDate, endDate);
        return ResponseEntity.ok(revenueMap);
    }

    @GetMapping("/user")
    public ResponseEntity<?> getListByUser(@RequestParam("username") String username) {
        List<Order> list = null;
        try {
            list = orderService.getOrderByUserName(username);
            return ResponseEntity.ok(list);
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/create")
    @Transactional
    public ResponseData<String> placeOrder(@RequestBody OrderDTO orderDTO) {
        try {
            orderService.placeOrder(orderDTO);
            emailService.sendOrderEmail(orderDTO);
            return new ResponseData<>(HttpStatus.OK, "Success", "Order thành công");
        } catch (DataNotFoundException e) {
            return new ResponseData<>(HttpStatus.OK, "Fail", "Order thất bại");
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_EMPLOYEE')")
    public ResponseEntity<?> enableOrderById(@PathVariable int id) {
        try {
            orderService.enableOrder(id);
            return ResponseEntity.ok("Cập nhật thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Cập nhật không thành công:" + e.getMessage());
        }
    }

    // Lấy chi tiết đơn hàng theo ID
    @GetMapping("/{id}")
    public ResponseData<Order> getOrderById(@PathVariable int id) {
        return orderService.getOrderById(id)
                .map(order -> new ResponseData<>(HttpStatus.OK, "Success", order))
                .orElse(new ResponseData<>(HttpStatus.NOT_FOUND, "Order not found"));
    }

    // Cập nhật trạng thái thanh toán
    @PutMapping("/{id}/payment-status")
    public ResponseData<Order> updatePaymentStatus(@PathVariable int id, @RequestParam String status) {
        try {
            Order updatedOrder = orderService.updatePaymentStatus(id, status);
            return new ResponseData<>(HttpStatus.OK, "Payment status updated", updatedOrder);
        } catch (Exception e) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    // Xóa mềm đơn hàng
    @DeleteMapping("/{id}")
    public ResponseData<?> deleteOrder(@PathVariable int id) {
        try {
            orderService.softDeleteOrder(id);
            return new ResponseData<>(HttpStatus.OK, "Order deleted successfully");
        } catch (Exception e) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}
