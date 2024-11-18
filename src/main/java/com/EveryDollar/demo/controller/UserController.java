package com.EveryDollar.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.EveryDollar.demo.dto.LoginDTO;
import com.EveryDollar.demo.entity.UserEntity;
import com.EveryDollar.demo.service.UserService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserEntity user , HttpSession session) {

        String response = userService.registerUser(user);

        if (response.equals("User registered successfully!")) {
            
            UserEntity savedUser = userService.findByUsername(user.getUsername());
            session.setAttribute("loggedInUser", savedUser);

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody LoginDTO loginDTO , HttpSession session) {
        String response = userService.loginUser(loginDTO);

        if (response.equals("Login successful!")) {

            UserEntity user = userService.findByUsername(loginDTO.getUsername());
            session.setAttribute("loggedInUser", user);

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logout successful!");
    }

    @PostMapping("/check")
    public ResponseEntity<String> checkSession(HttpSession session) {
        UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");
        
        if (loggedInUser != null) {
            return ResponseEntity.ok("Session is active for user: " + loggedInUser.getUsername());
        } else {
            return ResponseEntity.badRequest().body("No active session.");
        }
    }

}
