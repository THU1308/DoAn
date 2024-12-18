package com.Website_Selling_Clother.service.Imp;

import com.Website_Selling_Clother.entity.User;
import com.Website_Selling_Clother.repository.UserRepository;
import com.Website_Selling_Clother.service.IResetPassword;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ResetPasswordService implements IResetPassword {

    @Autowired
    JavaMailSender javaMailSender;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;


    @Override
    public boolean sendResetPasswordEmail(String email) throws Exception {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            // Tạo mật khẩu mới
            String newPassword = generateNewPassword();
            // Cập nhật mật khẩu mới cho user
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            // Gửi email thông báo về mật khẩu mới
            sendEmail(user,email, newPassword);
            return true;
        } else {
            // Xử lý khi không tìm thấy user
            return false;
        }
    }

    private void sendEmail(User user,String email, String newPassword) throws Exception {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Reset Password");
            message.setText("Username: " + user.getUsername() + "\nYour new password is: " + newPassword);
            javaMailSender.send(message);
        }catch (Exception e){
           throw new Exception(e.getMessage());
        }
    }

    private String generateNewPassword() {

        return "1234";
    }
}
