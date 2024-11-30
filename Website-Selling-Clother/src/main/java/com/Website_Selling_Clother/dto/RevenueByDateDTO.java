package com.Website_Selling_Clother.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueByDateDTO {
    private Date date;
    private long totalRevenue;
}

