package com.Website_Selling_Clother.dto;


import com.Website_Selling_Clother.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {

    private String firstName;

    private String lastName;

    private String country;

    private String address;

    private String town;

    private String state;

    private long postCode;

    private String email;

    private String note;

    private String phone;

    private String username;

    private long totalPrice;

    private List<OrderDetailDTO> orderDetailDTOS;

    private String paymentStatus;
    public static OrderDTO fromOrder(Order order){
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setFirstName(order.getFirstName());
        orderDTO.setLastName(order.getLastName());
        orderDTO.setCountry(order.getCountry());
        orderDTO.setAddress(order.getAddress());
        orderDTO.setTown(order.getTown());
        orderDTO.setState(order.getState());
        orderDTO.setPostCode(order.getPostCode());
        orderDTO.setEmail(order.getEmail());
        orderDTO.setNote(order.getNote());
        orderDTO.setPhone(order.getPhone());
        orderDTO.setTotalPrice(order.getTotalPrice());
        orderDTO.setUsername(order.getUser().getUsername());
        orderDTO.setPaymentStatus(order.getPaymentStatus());
        List<OrderDetailDTO> dtoList = new ArrayList<>();
        if(!order.getOrderdetails().isEmpty()){
            for (var item:order.getOrderdetails()) {
                OrderDetailDTO orderDetailDTO = new OrderDetailDTO();
                orderDetailDTO.setProductId(item.getProduct().getId());
                orderDetailDTO.setSizeId(item.getProductSize().getSize().getId());
                orderDetailDTO.setQuantity(item.getQuantity());
                orderDetailDTO.setPrice(item.getPrice());
                orderDetailDTO.setSubTotal(item.getSubTotal());
                dtoList.add(orderDetailDTO);
            }
            orderDTO.setOrderDetailDTOS(dtoList);
        }
        return orderDTO;
    }
}
