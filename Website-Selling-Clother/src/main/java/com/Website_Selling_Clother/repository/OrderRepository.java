package com.Website_Selling_Clother.repository;

import com.Website_Selling_Clother.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface OrderRepository extends JpaRepository<Order,Integer> {
    @Query(value ="Select * from Orders where user_id = :id order by id desc",nativeQuery = true)
    List<Order> getOrderByUserId(int id);

    @Query(value = "SELECT COUNT(id) AS countId, SUM(total_price) AS revenue " +
            "FROM orders " +
            "WHERE DATE(created_At) BETWEEN :startDate AND :endDate ", nativeQuery = true)
    Map<String, Long> getRevenueByDateRange(String startDate,String endDate);
}
