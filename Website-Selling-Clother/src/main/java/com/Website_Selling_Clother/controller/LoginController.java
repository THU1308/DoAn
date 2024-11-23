package com.Website_Selling_Clother.controller;


import com.Website_Selling_Clother.controller.response.ResponseData;
import com.Website_Selling_Clother.exception.DataNotFoundException;
import com.Website_Selling_Clother.request.LoginRequest;
import com.Website_Selling_Clother.request.UserRequest;
import com.Website_Selling_Clother.response.LoginResponse;
import com.Website_Selling_Clother.service.Imp.LoginService;
import com.Website_Selling_Clother.utils.JwtUtilsHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*",maxAge = 3600)
@RequestMapping("${api.prefix}/login")
public class LoginController {

    @Autowired
    LoginService loginService;

    @Autowired
    JwtUtilsHelper jwtUtilsHelper;

    @PostMapping("/signin")
    public ResponseData<LoginResponse> signin(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println(loginService.checkLogin(loginRequest));
            return new ResponseData(HttpStatus.OK,"Success",loginService.checkLogin(loginRequest));
        } catch (DataNotFoundException e) {
            return new ResponseData(HttpStatus.BAD_REQUEST,"Login Fail");
        }
    }

    @GetMapping("api/v1/user/listUser")
    public ResponseData<String> listUser(){
        return new ResponseData<>(HttpStatus.OK,"Success");
    }

    @PostMapping("/signup")
    public ResponseEntity<?> sigup(@RequestBody UserRequest userRequest){
        return new ResponseEntity<>(loginService.addUser(userRequest), HttpStatus.OK);
    }
}
