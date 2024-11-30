package com.Website_Selling_Clother.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderStatisticsDTO {
    private long totalOrders;      // Tổng số đơn hàng
    private long totalRevenue;     // Tổng doanh thu
}
