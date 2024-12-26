package com.EveryDollar.demo.controller;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.EveryDollar.demo.entity.UserEntity;
import com.EveryDollar.demo.service.DashboardService;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/Dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;


    @GetMapping("/")
    public String renderDashboard(HttpSession session, Model model) {
        // Get logged-in user details from session
        UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");

        if (loggedInUser != null) {
            // Add user data to the model
            model.addAttribute("username", loggedInUser.getUsername());

            LocalDate currentDate = LocalDate.now();
            DayOfWeek currentDay = currentDate.getDayOfWeek();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy", Locale.ENGLISH);

            // Add day and date to the model
            model.addAttribute("currentDay", currentDay.name());
            model.addAttribute("currentDate", currentDate.format(formatter));

            // Fetch dashboard data
            Map<String, Object> dashboardData = dashboardService.getDashboardData(loggedInUser);
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                String currentMonthAssetDetailsJson = objectMapper.writeValueAsString(dashboardData.get("currentMonthAssetDetails"));
                String currentMonthDebtDetailsJson = objectMapper.writeValueAsString(dashboardData.get("currentMonthDebtDetails"));
                
                model.addAttribute("currentMonthAssetDetailsJson", currentMonthAssetDetailsJson);
                model.addAttribute("currentMonthDebtDetailsJson", currentMonthDebtDetailsJson);
            } catch (Exception e) {
                model.addAttribute("currentMonthAssetDetailsJson", "[]");
                model.addAttribute("currentMonthDebtDetailsJson", "[]");
            }
            model.addAttribute("dashboardData", dashboardData);

            return "Dasboard/index";
        } else {
            return "redirect:/User_login/login.html"; // Redirect to login page if session is invalid
        }
    }
}
