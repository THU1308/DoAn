package com.Website_Selling_Clother.service;



import com.Website_Selling_Clother.dto.UserDTO;
import com.Website_Selling_Clother.entity.User;
import com.Website_Selling_Clother.exception.DataNotFoundException;

import java.util.List;

public interface IUserService {

    User getUserByUsername(String username) throws DataNotFoundException;

    User updateUser(UserDTO userDTO) throws DataNotFoundException;

    User enableUser(String username) throws DataNotFoundException;

    User updateUserRole(String username) throws DataNotFoundException;

    List<User> getListEmployee() throws DataNotFoundException;
    List<User> getListUser() throws DataNotFoundException;
}
