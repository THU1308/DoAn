package com.Website_Selling_Clother.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueByYearDTO {
    private int year;
    private long totalRevenue;
}
