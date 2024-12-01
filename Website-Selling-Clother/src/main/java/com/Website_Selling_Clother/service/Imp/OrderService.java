package com.Website_Selling_Clother.service.Imp;

import com.Website_Selling_Clother.dto.*;
import com.Website_Selling_Clother.entity.*;
import com.Website_Selling_Clother.exception.DataNotFoundException;
import com.Website_Selling_Clother.repository.*;
import com.Website_Selling_Clother.service.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.util.*;

@Service
public class OrderService implements IOrderService {

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderDetailRepository orderDetailRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    ProductSizeRepository productSizeRepository;

    @Override
    public List<Order> getAllListOrder() {
        return orderRepository.findAll();
    }

    @Override
    public void placeOrder(OrderDTO orderDTO) throws DataNotFoundException {
        Order order = new Order();
        Date currentTime = new Date();
        User user = userRepository.findByUserName(orderDTO.getUsername());
        order.setFirstName(orderDTO.getFirstName());
        order.setLastName(orderDTO.getLastName());
        order.setCountry(orderDTO.getCountry());
        order.setAddress(orderDTO.getAddress());
        order.setTown(orderDTO.getTown());
        order.setState(orderDTO.getState());
        order.setPostCode(orderDTO.getPostCode());
        order.setEmail(orderDTO.getEmail());
        order.setPhone(orderDTO.getPhone());
        order.setNote(orderDTO.getNote());
        order.setCreateAt(currentTime);
        order.setEnable(true);
        order.setPaymentStatus(orderDTO.getPaymentStatus());
        orderRepository.save(order);
        long sum = 0;
        for(var item: orderDTO.getOrderDetailDTOS()){
            OrderDetail orderDetail = new OrderDetail();
            Product product = productRepository.findById(item.getProductId());
            ProductSize productSize = productSizeRepository.getQuantity(product.getId(), item.getSizeId());
            orderDetail.setProduct(product);
            orderDetail.setProductSize(productSize);
            orderDetail.setPrice(item.getPrice());
            orderDetail.setQuantity(item.getQuantity());
            orderDetail.setSubTotal(item.getPrice() * item.getQuantity());
            orderDetail.setOrder(order);
            sum += orderDetail.getSubTotal();
            orderDetailRepository.save(orderDetail);
        }
        order.setTotalPrice(sum);
        order.setUser(user);
        orderRepository.save(order);
    }

    @Override
    public List<Order> getOrderByUserName(String userName) throws DataNotFoundException {
        User user = userRepository.findByUserName(userName);
        if (user == null){
            throw new DataNotFoundException("Không tìm thấy username: " + userName);
        }
        List<Order> orders = orderRepository.getOrderByUserId(user.getId());
        return orders;
    }

    @Override
    public Map<String, Long> getRevenueByDate(String startDate,String endDate) {
        return orderRepository.getRevenueByDateRange(startDate, endDate);
    }

    @Override
    public void enableOrder(int id) throws DataNotFoundException {
        Order order = orderRepository.findById(id).orElseThrow(()-> new DataNotFoundException("Không tìm thấy order id"));
        if(order.isEnable()){
            order.setEnable(false);
        }
        else {
            order.setEnable(true);
        }
        orderRepository.save(order);
    }

    // Lấy danh sách đơn hàng chưa bị xóa
    public List<Order> getAllOrders() {
        return orderRepository.findByEnableTrue();
    }

    // Lấy thông tin chi tiết một đơn hàng
    public Optional<Order> getOrderById(int id) {
        return orderRepository.findById(id);
    }

    // Cập nhật trạng thái thanh toán của đơn hàng
    public Order updatePaymentStatus(int id, String paymentStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setPaymentStatus(paymentStatus);
        return orderRepository.save(order);
    }

    // Xóa mềm đơn hàng
    public void softDeleteOrder(int id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setEnable(false); // Đánh dấu là đã xóa
        orderRepository.save(order);
    }

    // Lấy các đơn hàng hoàn tất trong khoảng thời gian
    public List<Order> getOrdersBetweenDates(Date startDate, Date endDate, String paymentStatus) {
        return orderRepository.findByCreateAtBetweenAndPaymentStatus(startDate, endDate,  paymentStatus);
    }
    public ByteArrayInputStream generateOrderReport(Date startDate, Date endDate,String paymentStatus) {
        List<Order> orders = getOrdersBetweenDates(startDate, endDate,paymentStatus);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(outputStream);

        // Header CSV
        writer.println("ID,First Name,Last Name,Country,Address,Town,State,Post Code,Email,Phone,Note,Total Price,Created At,Enable,Payment Status");

        for (Order order : orders) {
            writer.printf("%d,%s,%s,%s,%s,%s,%s,%d,%s,%s,%s,%d,%s,%b,%s%n",
                    order.getId(),
                    order.getFirstName(),
                    order.getLastName(),
                    order.getCountry(),
                    order.getAddress(),
                    order.getTown(),
                    order.getState(),
                    order.getPostCode(),
                    order.getEmail(),
                    order.getPhone(),
                    order.getNote(),
                    order.getTotalPrice(),
                    order.getCreateAt(),
                    order.isEnable(),
                    order.getPaymentStatus());
        }

        writer.flush();
        return new ByteArrayInputStream(outputStream.toByteArray());
    }
}
