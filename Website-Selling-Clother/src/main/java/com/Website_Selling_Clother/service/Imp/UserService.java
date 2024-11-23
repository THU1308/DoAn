package com.Website_Selling_Clother.service.Imp;

import com.Website_Selling_Clother.dto.UserDTO;
import com.Website_Selling_Clother.entity.ERole;
import com.Website_Selling_Clother.entity.Role;
import com.Website_Selling_Clother.entity.User;
import com.Website_Selling_Clother.exception.DataNotFoundException;
import com.Website_Selling_Clother.repository.RoleRepository;
import com.Website_Selling_Clother.repository.UserRepository;
import com.Website_Selling_Clother.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService implements IUserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public User getUserByUsername(String username) throws DataNotFoundException {
        User user = userRepository.findByUserName(username);
        if(user == null){
            throw new DataNotFoundException("Không tìm thấy username: " + username);
        }
        return user;
    }

    @Override
    public User updateUser(UserDTO userDTO) throws DataNotFoundException {
        User user = userRepository.findByUserName(userDTO.getUserName());
        if(user == null){
            throw new DataNotFoundException("Không tìm thấy username: " + userDTO.getUserName());
        }
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());
        user.setCountry(userDTO.getCountry());
        user.setState(userDTO.getState());
        user.setAddress(userDTO.getAddress());
        user.setPhone(userDTO.getPhone());
        userRepository.save(user);
        return user;
    }

    @Override
    public User enableUser(String username) throws DataNotFoundException {
        User user = userRepository.findByUserName(username);
        if(user.isEnable()){
            user.setEnable(false);
        }else {
            user.setEnable(true);
        }
        userRepository.save(user);
        return user;
    }

    @Override
    public User updateUserRole(String username) throws DataNotFoundException {
        User user = userRepository.findByUserName(username);
        if(user == null){
            throw new DataNotFoundException("Không tìm thấy username: " + username);
        }
        Role role = roleRepository.findByName(ERole.ROLE_EMPLOYEE).orElseThrow(()->new DataNotFoundException("Không tìm thấy role"));
        user.setRole(role);
        userRepository.save(user);
        return user;
    }

    @Override
    public List<User> getListEmployee() throws DataNotFoundException {
        List<User> users = userRepository.findAll();
        List<User> employees = new ArrayList<>();
        for (var item:users) {
            if(item.getRole().getId() == 3){
                employees.add(item);
            }
        }
        return employees;
    }

    @Override
    public List<User> getListUser() throws DataNotFoundException {
        List<User> users = userRepository.findAll();
        List<User> employees = new ArrayList<>();
        for (var item:users) {
            if(item.getRole().getId() == 2){
                employees.add(item);
            }
        }
        return employees;
    }
}
