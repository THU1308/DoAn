package com.Website_Selling_Clother.service;



import com.Website_Selling_Clother.dto.OrderDTO;
import com.Website_Selling_Clother.entity.Order;
import com.Website_Selling_Clother.exception.DataNotFoundException;

import java.util.List;
import java.util.Map;

public interface IOrderService {

    List<Order> getAllListOrder();

    void placeOrder(OrderDTO orderDTO) throws DataNotFoundException;

    List<Order> getOrderByUserName(String userName) throws DataNotFoundException;

    Map<String,Long> getRevenueByDate(String startDate, String endDate);

    void enableOrder(int id) throws DataNotFoundException;
}
