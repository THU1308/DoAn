package com.Website_Selling_Clother.service;

public interface IResetPassword {
    boolean sendResetPasswordEmail(String email) throws Exception;
}
