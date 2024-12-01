package com.Website_Selling_Clother.repository;

import com.Website_Selling_Clother.dto.RevenueByDateDTO;
import com.Website_Selling_Clother.dto.RevenueByMonthDTO;
import com.Website_Selling_Clother.dto.RevenueByYearDTO;
import com.Website_Selling_Clother.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    // Lấy danh sách đơn hàng theo trạng thái thanh toán
    List<Order> findByPaymentStatus(String paymentStatus);

    // Lấy danh sách đơn hàng đã thanh toán hoàn tất trong khoảng thời gian
    List<Order> findByCreateAtBetweenAndPaymentStatus(Date startDate, Date endDate, String paymentStatus);

    // Doanh thu theo ngày
    @Query("SELECT new com.Website_Selling_Clother.dto.RevenueByDateDTO(o.createAt, SUM(o.totalPrice)) " +
            "FROM Order o WHERE o.paymentStatus = 'completed' GROUP BY o.createAt ORDER BY o.createAt")
    List<RevenueByDateDTO> getRevenueByDate();

    // Doanh thu theo tháng
    @Query("SELECT new com.Website_Selling_Clother.dto.RevenueByMonthDTO(EXTRACT(MONTH FROM o.createAt), EXTRACT(YEAR FROM o.createAt), SUM(o.totalPrice)) " +
            "FROM Order o WHERE o.paymentStatus = 'completed' GROUP BY EXTRACT(YEAR FROM o.createAt), EXTRACT(MONTH FROM o.createAt) ORDER BY EXTRACT(YEAR FROM o.createAt), EXTRACT(MONTH FROM o.createAt)")
    List<RevenueByMonthDTO> getRevenueByMonth();

    // Doanh thu theo năm
    @Query("SELECT new com.Website_Selling_Clother.dto.RevenueByYearDTO(EXTRACT(YEAR FROM o.createAt), SUM(o.totalPrice)) " +
            "FROM Order o WHERE o.paymentStatus = 'completed' GROUP BY EXTRACT(YEAR FROM o.createAt) ORDER BY EXTRACT(YEAR FROM o.createAt)")
    List<RevenueByYearDTO> getRevenueByYear();

    // Đếm tổng số đơn hàng
    @Query("SELECT COUNT(o) FROM Order o WHERE o.paymentStatus = 'completed'")
    long countOrders();

    // Tính tổng doanh thu
    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.paymentStatus = 'completed'")
    long sumTotalPrice();

//    =======================================

    // Đếm số đơn hàng đã hoàn thành trong khoảng thời gian
    @Query("SELECT COUNT(o) FROM Order o WHERE o.paymentStatus = 'completed' AND o.createAt BETWEEN :startDate AND :endDate")
    long countOrdersBetween(Date startDate, Date endDate);

    // Tính tổng doanh thu trong khoảng thời gian
    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.paymentStatus = 'completed' AND o.createAt BETWEEN :startDate AND :endDate")
    long sumTotalPriceBetween(Date startDate, Date endDate);

    // Doanh thu theo ngày trong khoảng thời gian
    @Query("SELECT new com.Website_Selling_Clother.dto.RevenueByDateDTO(o.createAt, SUM(o.totalPrice)) " +
            "FROM Order o WHERE o.paymentStatus = 'completed' AND o.createAt BETWEEN :start AND :end GROUP BY o.createAt ORDER BY o.createAt")
    List<RevenueByDateDTO> getRevenueByDateBetween(@Param("start") Date start, @Param("end") Date end);

    // Doanh thu theo tháng trong khoảng thời gian
    @Query("SELECT new com.Website_Selling_Clother.dto.RevenueByMonthDTO(EXTRACT(MONTH FROM o.createAt), EXTRACT(YEAR FROM o.createAt), SUM(o.totalPrice)) " +
            "FROM Order o WHERE o.paymentStatus = 'completed' AND o.createAt BETWEEN :start AND :end GROUP BY EXTRACT(YEAR FROM o.createAt), EXTRACT(MONTH FROM o.createAt) ORDER BY EXTRACT(YEAR FROM o.createAt), EXTRACT(MONTH FROM o.createAt)")
    List<RevenueByMonthDTO> getRevenueByMonthBetween(@Param("start") Date start, @Param("end") Date end);

    // Doanh thu theo năm trong khoảng thời gian
    @Query("SELECT new com.Website_Selling_Clother.dto.RevenueByYearDTO(EXTRACT(YEAR FROM o.createAt), SUM(o.totalPrice)) " +
            "FROM Order o WHERE o.paymentStatus = 'completed' AND o.createAt BETWEEN :start AND :end GROUP BY EXTRACT(YEAR FROM o.createAt) ORDER BY EXTRACT(YEAR FROM o.createAt)")
    List<RevenueByYearDTO> getRevenueByYearBetween(@Param("start") Date start, @Param("end") Date end);

}
