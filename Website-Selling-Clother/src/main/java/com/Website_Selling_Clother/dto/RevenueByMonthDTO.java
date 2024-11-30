package com.Website_Selling_Clother.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueByMonthDTO {
    private int month;
    private int year;
    private long totalRevenue;
}

