package com.EveryDollar.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.EveryDollar.demo.dto.LoginDTO;
import com.EveryDollar.demo.dto.UpdateProfileDTO;
import com.EveryDollar.demo.entity.UserEntity;
import com.EveryDollar.demo.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;

    public String registerUser(UserEntity user) {
        boolean isEmailTaken = userRepository.existsByEmailAddress(user.getEmailAddress());
        boolean isUsernameTaken = userRepository.existsByUsername(user.getUsername());
        
        if (isEmailTaken && isUsernameTaken) {
            return "Both email and username are already in use!";
        } else if (isEmailTaken) {
            return "Email is already in use!";
        } else if (isUsernameTaken) {
            return "Username is already in use!";
        }
        
        userRepository.save(user);
        return "User registered successfully!";
    }


    public String loginUser(LoginDTO loginDTO) {

        UserEntity user = userRepository.findByUsername(loginDTO.getUsername());

        if (user == null) {
            return "Username not found!";
        }

        if (loginDTO.getPassword().equals(user.getPassword())) {
            return "Login successful!";
        } else {
            return "Incorrect password!";
        }
    }

    public UserEntity findByUsername(String username) {
        return userRepository.findByUsername(username);
    }


    public String updateUserProfile(UpdateProfileDTO updateProfileDTO, UserEntity loggedInUser) {
        if (updateProfileDTO.getUsername() != null &&
            !updateProfileDTO.getUsername().equals(loggedInUser.getUsername()) &&
            userRepository.existsByUsername(updateProfileDTO.getUsername())) {
            return "Username is already in use!";
        }
    
        if (updateProfileDTO.getEmailAddress() != null &&
            !updateProfileDTO.getEmailAddress().equals(loggedInUser.getEmailAddress()) &&
            userRepository.existsByEmailAddress(updateProfileDTO.getEmailAddress())) {
            return "Email address is already in use!";
        }
    
        if (updateProfileDTO.getCurrentPassword() != null &&
        !updateProfileDTO.getCurrentPassword().isEmpty() &&
        !loggedInUser.getPassword().equals(updateProfileDTO.getCurrentPassword())) {
        return "Current password is incorrect!";
}
    
        if (updateProfileDTO.getNewPassword() != null && 
            !updateProfileDTO.getNewPassword().equals(updateProfileDTO.getConfirmNewPassword())) {
            return "New password and confirm password do not match!";
        }
    
        if (updateProfileDTO.getUsername() != null && !updateProfileDTO.getUsername().isEmpty()) {
            loggedInUser.setUsername(updateProfileDTO.getUsername());
        }
    
        if (updateProfileDTO.getEmailAddress() != null && !updateProfileDTO.getEmailAddress().isEmpty()) {
            loggedInUser.setEmailAddress(updateProfileDTO.getEmailAddress());
        }
    
        if (updateProfileDTO.getNewPassword() != null && !updateProfileDTO.getNewPassword().isEmpty()) {
            loggedInUser.setPassword(updateProfileDTO.getNewPassword());
        }
    
        userRepository.save(loggedInUser);
        return "Profile updated successfully!";
    }
}
