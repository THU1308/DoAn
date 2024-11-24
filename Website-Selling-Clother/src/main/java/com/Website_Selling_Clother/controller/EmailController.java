package com.Website_Selling_Clother.controller;

import com.Website_Selling_Clother.controller.response.ResponseData;
import com.Website_Selling_Clother.dto.OrderDTO;
import com.Website_Selling_Clother.service.Imp.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*",maxAge = 3600)
@RequestMapping("${api.prefix}/email")
public class EmailController {
    @Autowired
    EmailService emailService;

    @PostMapping("/sendOrderToEmail")
    public ResponseData<?> senOrderToEmail(@RequestBody OrderDTO orderDTO){
        emailService.sendOrderEmail(orderDTO);
        return new ResponseData<>(HttpStatus.OK,"Success");
    }
}
