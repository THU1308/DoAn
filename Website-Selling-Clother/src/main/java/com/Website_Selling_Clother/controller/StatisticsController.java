package com.Website_Selling_Clother.controller;

import com.Website_Selling_Clother.controller.response.ResponseData;
import com.Website_Selling_Clother.dto.OrderStatisticsDTO;
import com.Website_Selling_Clother.dto.RevenueByDateDTO;
import com.Website_Selling_Clother.dto.RevenueByMonthDTO;
import com.Website_Selling_Clother.dto.RevenueByYearDTO;
import com.Website_Selling_Clother.entity.Order;
import com.Website_Selling_Clother.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/statistics")
@CrossOrigin(origins = "*", maxAge = 3600)
public class StatisticsController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/orders")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<OrderStatisticsDTO> getOrderStatistics(@RequestParam(required = false) String startDate,
                                                                 @RequestParam(required = false) String endDate) {

        OrderStatisticsDTO statistics = new OrderStatisticsDTO();
        if (startDate != null && endDate != null) {
            try {
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date start = dateFormat.parse(startDate);
                Date end = dateFormat.parse(endDate);

                // Kiểm tra nếu startDate không lớn hơn endDate
                if (start.after(end)) {
                    return ResponseEntity.badRequest().body(null);
                }

                long totalOrders = orderRepository.countOrdersBetween(start, end);
                long totalRevenue = orderRepository.sumTotalPriceBetween(start, end);
                statistics.setTotalOrders(totalOrders);
                statistics.setTotalRevenue(totalRevenue);

            } catch (ParseException e) {
                return ResponseEntity.badRequest().body(null);
            }
        } else {
            long totalOrders = orderRepository.countOrders();
            long totalRevenue = orderRepository.sumTotalPrice();
            statistics.setTotalOrders(totalOrders);
            statistics.setTotalRevenue(totalRevenue);
        }
        return ResponseEntity.ok(statistics);
    }



    @GetMapping("/revenue/date")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<RevenueByDateDTO>> getRevenueByDate(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        List<RevenueByDateDTO> revenueList;
        if (startDate != null && endDate != null) {
            try {
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date start = dateFormat.parse(startDate);
                Date end = dateFormat.parse(endDate);
                revenueList = orderRepository.getRevenueByDateBetween(start, end);
            } catch (ParseException e) {
                return ResponseEntity.badRequest().body(null);
            }
        } else {
            revenueList = orderRepository.getRevenueByDate();
        }
        return ResponseEntity.ok(revenueList);
    }

    @GetMapping("/revenue/month")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<RevenueByMonthDTO>> getRevenueByMonth(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        List<RevenueByMonthDTO> revenueList;
        if (startDate != null && endDate != null) {
            try {
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date start = dateFormat.parse(startDate);
                Date end = dateFormat.parse(endDate);
                revenueList = orderRepository.getRevenueByMonthBetween(start, end);
            } catch (ParseException e) {
                return ResponseEntity.badRequest().body(null);
            }
        } else {
            revenueList = orderRepository.getRevenueByMonth();
        }
        return ResponseEntity.ok(revenueList);
    }

    @GetMapping("/revenue/year")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<RevenueByYearDTO>> getRevenueByYear(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        List<RevenueByYearDTO> revenueList;
        if (startDate != null && endDate != null) {
            try {
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date start = dateFormat.parse(startDate);
                Date end = dateFormat.parse(endDate);
                revenueList = orderRepository.getRevenueByYearBetween(start, end);
            } catch (ParseException e) {
                return ResponseEntity.badRequest().body(null);
            }
        } else {
            revenueList = orderRepository.getRevenueByYear();
        }
        return ResponseEntity.ok(revenueList);
    }

    @GetMapping("/between")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseData<List<Order>> getOrderBetween(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam String paymentStatus) {
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date start = null;
            Date end = null;

            if (startDate != null && !startDate.isEmpty()) {
                start = dateFormat.parse(startDate);
            }

            if (endDate != null && !endDate.isEmpty()) {
                end = dateFormat.parse(endDate);
            }

            List<Order> orders;
            if (start != null && end != null) {
                // Kiểm tra nếu startDate lớn hơn endDate
                if (start.after(end)) {
                    return new ResponseData<>(HttpStatus.BAD_REQUEST, "Start date must be before end date", null);
                }
                orders = orderRepository.findByCreateAtBetweenAndPaymentStatus(start, end, paymentStatus);
            } else {
                // Nếu không có khoảng thời gian, lấy tất cả đơn hàng
                orders = orderRepository.findByPaymentStatus(paymentStatus); // Bạn cần định nghĩa phương thức này trong repository
            }
            return new ResponseData<>(HttpStatus.OK, "Success", orders);

        } catch (ParseException e) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST, "Invalid date format. Use 'yyyy-MM-dd'", null);
        } catch (Exception e) {
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred: " + e.getMessage(), null);
        }
    }
}
