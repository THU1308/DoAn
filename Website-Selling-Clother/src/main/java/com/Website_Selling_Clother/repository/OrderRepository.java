package com.Website_Selling_Clother.repository;

import com.Website_Selling_Clother.dto.RevenueByDateDTO;
import com.Website_Selling_Clother.dto.RevenueByMonthDTO;
import com.Website_Selling_Clother.dto.RevenueByYearDTO;
import com.Website_Selling_Clother.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
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

    List<Order> findByEnableTrue();

    // Lấy danh sách đơn hàng đã thanh toán hoàn tất trong khoảng thời gian
    List<Order> findByCreateAtBetweenAndPaymentStatus(Date startDate, Date endDate, String paymentStatus);

    // Doanh thu theo ngày
    @Query("SELECT new com.Website_Selling_Clother.dto.RevenueByDateDTO(o.createAt, SUM(o.totalPrice)) " +
            "FROM Order o GROUP BY o.createAt ORDER BY o.createAt")
    List<RevenueByDateDTO> getRevenueByDate();

    // Doanh thu theo tháng
    @Query("SELECT new com.Website_Selling_Clother.dto.RevenueByMonthDTO(EXTRACT(MONTH FROM o.createAt), EXTRACT(YEAR FROM o.createAt), SUM(o.totalPrice)) " +
            "FROM Order o GROUP BY EXTRACT(YEAR FROM o.createAt), EXTRACT(MONTH FROM o.createAt) ORDER BY EXTRACT(YEAR FROM o.createAt), EXTRACT(MONTH FROM o.createAt)")
    List<RevenueByMonthDTO> getRevenueByMonth();

    // Doanh thu theo năm
    @Query("SELECT new com.Website_Selling_Clother.dto.RevenueByYearDTO(EXTRACT(YEAR FROM o.createAt), SUM(o.totalPrice)) " +
            "FROM Order o GROUP BY EXTRACT(YEAR FROM o.createAt) ORDER BY EXTRACT(YEAR FROM o.createAt)")
    List<RevenueByYearDTO> getRevenueByYear();

    // Đếm tổng số đơn hàng
    @Query("SELECT COUNT(o) FROM Order o")
    long countOrders();

    // Tính tổng doanh thu
    @Query("SELECT SUM(o.totalPrice) FROM Order o")
    long sumTotalPrice();
}
