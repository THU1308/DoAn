package com.example.shopclothes.service.Imp;

import com.example.shopclothes.dto.UserDTO;
import com.example.shopclothes.entity.User;
import com.example.shopclothes.exception.DataNotFoundException;

import java.util.List;

public interface IUserService {

    User getUserByUsername(String username) throws DataNotFoundException;

    User updateUser(UserDTO userDTO) throws DataNotFoundException;

    User enableUser(String username) throws DataNotFoundException;

    User updateUserRole(String username) throws DataNotFoundException;

    List<User> getListEmployee() throws DataNotFoundException;
    List<User> getListUser() throws DataNotFoundException;
}
