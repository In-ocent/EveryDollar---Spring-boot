package com.EveryDollar.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
