package com.Website_Selling_Clother.controller;

import com.Website_Selling_Clother.controller.response.ResponseData;
import com.Website_Selling_Clother.dto.UserDTO;
import com.Website_Selling_Clother.entity.User;
import com.Website_Selling_Clother.exception.DataNotFoundException;
import com.Website_Selling_Clother.service.Imp.ResetPasswordService;
import com.Website_Selling_Clother.service.Imp.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/user")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    UserService userService;

    @Autowired
    ResetPasswordService resetPasswordService;

    @GetMapping("/current-user")
    public ResponseData<UserDetails> getCurrentUserLogin() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) principal;
            System.out.println(userDetails.getUsername());
            return new ResponseData<>(HttpStatus.OK,"Success",userDetails);
        }
        return null;
    }

    @GetMapping("")
    public ResponseData<User> getUser(@RequestParam("username") String username){
        User user = null;
        try {
            user = userService.getUserByUsername(username);
            return new ResponseData<>(HttpStatus.OK,"Success",user);
        } catch (DataNotFoundException e) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST,"Failed");
        }
    }

    @GetMapping("/listUser")
    public ResponseData<List<User>> getListUser(){
        List<User> users = null;
        try {
            users = userService.getListUser();
            return new ResponseData<>(HttpStatus.OK,"Success",users);
        } catch (DataNotFoundException e) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST,"Failed");
        }
    }

    @GetMapping("/employee")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseData<List<User>> getListEmployee(){
        List<User> users = null;
        try {
            users = userService.getListEmployee();
            return new ResponseData<>(HttpStatus.OK,"Success",users);
        } catch (DataNotFoundException e) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST,"Failed");
        }
    }

    @PutMapping("/update")
    public ResponseData<User> updateProfile(@RequestBody UserDTO userDTO){
        User user = null;
        try {
            user = userService.updateUser(userDTO);
            return new ResponseData<>(HttpStatus.OK,"Success",user);
        } catch (DataNotFoundException e) {
            return new ResponseData<>(HttpStatus.OK,"Failed");
        }
    }

    @PutMapping("/updateRole")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public ResponseData<User> updateRole(@RequestParam String username){
        User user = null;
        try {
            user = userService.updateUserRole(username);
            return new ResponseData<>(HttpStatus.OK,"Success",user);
        } catch (DataNotFoundException e) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST,"Failed");
        }
    }
    @PutMapping("/enable")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public ResponseData<User> enableEmployee(@RequestParam String username){
        User user = null;
        try {
            user = userService.enableUser(username);
            return new ResponseData<>(HttpStatus.OK,username);
        } catch (DataNotFoundException e) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST,"Failed");
        }
    }

    @PostMapping("/resetPw")
    @Transactional
    public ResponseData<String> resetPassword(@RequestParam String email) {
        try {
            if (resetPasswordService.sendResetPasswordEmail(email)){
                return new ResponseData<>(HttpStatus.OK,"Reset password email sent successfully");
            }
        }catch (Exception e){
            return new ResponseData<>(HttpStatus.NO_CONTENT,"Failed");
        }
        return new ResponseData<>(HttpStatus.BAD_REQUEST,"Failed");
    }
}
