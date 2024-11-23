package com.Website_Selling_Clother.service;

import com.Website_Selling_Clother.dto.UserDTO;
import com.Website_Selling_Clother.exception.DataNotFoundException;
import com.Website_Selling_Clother.request.LoginRequest;
import com.Website_Selling_Clother.request.UserRequest;
import com.Website_Selling_Clother.response.LoginResponse;

import java.util.List;

public interface ILoginService {

    List<UserDTO> getAllUser();
    LoginResponse checkLogin(LoginRequest loginRequest) throws DataNotFoundException;
    boolean addUser(UserRequest userRequest);
}
