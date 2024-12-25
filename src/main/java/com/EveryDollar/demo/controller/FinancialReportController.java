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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

// import com.EveryDollar.demo.dto.ReportDTO;
import com.EveryDollar.demo.entity.UserEntity;
import com.EveryDollar.demo.service.ReportService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/Report")
class ReportController {
    @GetMapping("/")
    public String renderNetworth(HttpSession session, Model model) {
        // Get logged-in user details from session
        UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");

        if (loggedInUser != null) {
            // Add user data to the model
            model.addAttribute("username", loggedInUser.getUsername());

            LocalDate currentDate = LocalDate.now();
            DayOfWeek currentDay = currentDate.getDayOfWeek();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy", Locale.ENGLISH);

            // Add day and date to the model
            model.addAttribute("currentDay", currentDay.name()); // E.g., "WEDNESDAY"
            model.addAttribute("currentDate", currentDate.format(formatter)); // E.g., "February 22, 2023"
            
            return "FinancialReport/index"; // Ensure the correct template name
        } else {
            return "redirect:/User_login/login.html"; // Redirect to login page if session is invalid
        }
    }
}

@RestController
@RequestMapping("/financial-report")
public class FinancialReportController {

    @Autowired
    private ReportService reportService;

    /**
     * Endpoint to fetch the financial report for a given month.
     *
     * @param month   The month (1 = January, ..., 12 = December).
     * @param session The current HTTP session to get the logged-in user.
     * @return A Map containing the financial report details.
     */
    @GetMapping("/{month}")
    @ResponseBody
    public Map<String, Object> getReport(@PathVariable int month, HttpSession session) {
        UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");
        if (loggedInUser == null) {
            throw new RuntimeException("User not logged in");
        }

        return reportService.generateMonthlyReport(loggedInUser, month);
    }
}