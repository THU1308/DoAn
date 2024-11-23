package com.Website_Selling_Clother.dto;

import com.Website_Selling_Clother.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private String userName;

    private String firstName;

    private String lastName;

    private String email;

    private String country;

    private String state;

    private String address;

    private String phone;

    public static UserDTO fromUser(User user){
       UserDTO userDTO = new UserDTO();
       userDTO.setUserName(user.getUsername());
       userDTO.setAddress(user.getAddress());
       userDTO.setCountry(user.getCountry());
       userDTO.setEmail(user.getEmail());
       userDTO.setPhone(user.getPhone());
       userDTO.setFirstName(user.getFirstName());
       userDTO.setLastName(user.getLastName());
       userDTO.setState(user.getState());
        return userDTO;
    }
}
