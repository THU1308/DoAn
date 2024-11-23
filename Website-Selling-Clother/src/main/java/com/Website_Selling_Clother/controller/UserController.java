package com.example.shopclothes.controller;

import com.example.shopclothes.dto.UserDTO;
import com.example.shopclothes.entity.User;
import com.example.shopclothes.exception.DataNotFoundException;
import com.example.shopclothes.service.ResetPasswordService;
import com.example.shopclothes.service.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Encoders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.crypto.SecretKey;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/user")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    UserService userService;

    @Autowired
    ResetPasswordService resetPasswordService;

    @GetMapping("")
    public ResponseEntity<?> getuser(@RequestParam("username") String username){
        User user = null;
        try {
            user = userService.getUserByUsername(username);
            return ResponseEntity.ok(user);
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/listUser")
    public ResponseEntity<?> getListUser(){
        List<User> users = null;
        try {
            users = userService.getListUser();
            return ResponseEntity.ok(users);
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/employee")
    public ResponseEntity<?> getListEmployee(){
        List<User> users = null;
        try {
            users = userService.getListEmployee();
            return ResponseEntity.ok(users);
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody UserDTO userDTO){
        User user = null;
        try {
            user = userService.updateUser(userDTO);
            return ResponseEntity.ok(UserDTO.fromUser(user));
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/updateRole")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateRole(@RequestParam String username){
        User user = null;
        try {
            user = userService.updateUserRole(username);
            return ResponseEntity.ok(UserDTO.fromUser(user));
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PutMapping("/enable")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> enableEmployee(@RequestParam String username){
        User user = null;
        try {
            user = userService.enableUser(username);
            return ResponseEntity.ok(UserDTO.fromUser(user));
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resetPw")
    public ResponseEntity<?> resetPassword(@RequestParam String email) {
        try {
            if (resetPasswordService.sendResetPasswordEmail(email)){
                return ResponseEntity.ok("Reset password email sent successfully");
            }
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Email không tồn tại hoặc " + e.getMessage());
        }
        return ResponseEntity.badRequest().body("Email không tồn tại");
    }
}
