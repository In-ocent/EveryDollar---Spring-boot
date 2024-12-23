package com.EveryDollar.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.EveryDollar.demo.dto.LoginDTO;
import com.EveryDollar.demo.dto.UpdateProfileDTO;
import com.EveryDollar.demo.entity.UserEntity;
import com.EveryDollar.demo.service.UserService;

import jakarta.servlet.http.HttpSession;

// import org.springframework.web.bind.annotation.CrossOrigin;


@RestController
@RequestMapping("/user")
// @CrossOrigin(origins = {"http://127.0.0.1:5501", "http://localhost:5501"}, allowCredentials = "true")
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


    @PostMapping("/dashboard/edit-profile")
    public ResponseEntity<String> editUserProfile(@RequestBody UpdateProfileDTO updateProfileDTO, HttpSession session) {
        UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");
        
        if (loggedInUser == null) {
            return ResponseEntity.badRequest().body("No active session. Please log in again.");
        }

        String response = userService.updateUserProfile(updateProfileDTO, loggedInUser);

        if (response.equals("Profile updated successfully!")) {
            session.setAttribute("loggedInUser", loggedInUser); 
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/details")
    public ResponseEntity<UserEntity> getUserDetails(HttpSession session) {
        UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");

        if (loggedInUser != null) {
            return ResponseEntity.ok(loggedInUser);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }


}
