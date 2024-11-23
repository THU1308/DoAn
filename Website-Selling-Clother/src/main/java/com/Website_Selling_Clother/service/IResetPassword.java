package com.example.shopclothes.service.Imp;

public interface IResetPassword {
    boolean sendResetPasswordEmail(String email) throws Exception;
}
