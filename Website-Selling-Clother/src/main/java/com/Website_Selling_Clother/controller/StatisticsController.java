package com.Website_Selling_Clother.controller;


import com.Website_Selling_Clother.dto.*;
import com.Website_Selling_Clother.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/statistics")
@CrossOrigin(origins = "*", maxAge = 3600)
public class StatisticsController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/orders")
    public ResponseEntity<OrderStatisticsDTO> getOrderStatistics() {
        long totalOrders = orderRepository.countOrders();
        long totalRevenue = orderRepository.sumTotalPrice();

        OrderStatisticsDTO statistics = new OrderStatisticsDTO();
        statistics.setTotalOrders(totalOrders);
        statistics.setTotalRevenue(totalRevenue);

        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/revenue/date")
    public ResponseEntity<List<RevenueByDateDTO>> getRevenueByDate() {
        List<RevenueByDateDTO> revenueList = orderRepository.getRevenueByDate();
        return ResponseEntity.ok(revenueList);
    }

    @GetMapping("/revenue/month")
    public ResponseEntity<List<RevenueByMonthDTO>> getRevenueByMonth() {
        List<RevenueByMonthDTO> revenueList = orderRepository.getRevenueByMonth();
        return ResponseEntity.ok(revenueList);
    }

    @GetMapping("/revenue/year")
    public ResponseEntity<List<RevenueByYearDTO>> getRevenueByYear() {
        List<RevenueByYearDTO> revenueList = orderRepository.getRevenueByYear();
        return ResponseEntity.ok(revenueList);
    }
}
