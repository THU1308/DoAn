package com.Website_Selling_Clother.service.Imp;

import com.Website_Selling_Clother.dto.UserDTO;
import com.Website_Selling_Clother.entity.ERole;
import com.Website_Selling_Clother.entity.Role;
import com.Website_Selling_Clother.entity.User;
import com.Website_Selling_Clother.exception.DataNotFoundException;
import com.Website_Selling_Clother.repository.RoleRepository;
import com.Website_Selling_Clother.repository.UserRepository;
import com.Website_Selling_Clother.request.LoginRequest;
import com.Website_Selling_Clother.request.UserRequest;
import com.Website_Selling_Clother.response.LoginResponse;
import com.Website_Selling_Clother.service.ILoginService;
import com.Website_Selling_Clother.utils.JwtUtilsHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class LoginService implements ILoginService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    JwtUtilsHelper jwtUtilsHelper;

    @Autowired
    AuthenticationManager authenticationManager;


    @Override
    public List<UserDTO> getAllUser() {
        List<User> listUser = userRepository.findAll();
        List<UserDTO> userDTOList = new ArrayList<>();
        for (var user : listUser) {
            UserDTO userDTO = UserDTO.fromUser(user);
            userDTOList.add(userDTO);
        }
        return userDTOList;
    }

    @Override
    public LoginResponse checkLogin(LoginRequest loginRequest) throws DataNotFoundException {
        User user = userRepository.findByUserName(loginRequest.getUserName());

        // Kiểm tra người dùng có tồn tại không
        if (user == null) {
            throw new DataNotFoundException("Sai tài khoản hoặc mật khẩu");
        }

        // Kiểm tra mật khẩu
        if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            String token = jwtUtilsHelper.generateToken(loginRequest.getUserName());
            return new LoginResponse(token, "Đăng nhập thành công");
        } else {
            throw new DataNotFoundException("Sai tài khoản hoặc mật khẩu");
        }
    }


    @Override
    @Transactional
    public boolean addUser(UserRequest userRequest) {
        try {
        User user = new User();
        Date currentTime = new Date();
        user.setUsername(userRequest.getUserName());
        user.setEmail(userRequest.getEmail());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setEnable(true);
        Role role = roleRepository.findByName(ERole.ROLE_USER).orElseThrow(() -> new DataNotFoundException("Không có role"));
        user.setRole(role);
        user.setCreateAt(currentTime);
        userRepository.save(user);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }
}
