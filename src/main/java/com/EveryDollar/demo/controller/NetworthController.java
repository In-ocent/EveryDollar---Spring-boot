package com.EveryDollar.demo.controller;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.EveryDollar.demo.entity.NetworthEntity;
import com.EveryDollar.demo.entity.UserEntity;
import com.EveryDollar.demo.service.NetworthService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/Networth")
class NetworthRender {
    @GetMapping("/")
    public String renderNetworth(HttpSession session, Model model) {
        UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");

        if (loggedInUser != null) {
            model.addAttribute("username", loggedInUser.getUsername());

            LocalDate currentDate = LocalDate.now();
            DayOfWeek currentDay = currentDate.getDayOfWeek();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy", Locale.ENGLISH);

            model.addAttribute("currentDay", currentDay.name()); 
            model.addAttribute("currentDate", currentDate.format(formatter)); 
            
            return "Networth/index"; 
        } else {
            return "redirect:/User_login/login.html"; 
        }
    }
}

@RestController
@RequestMapping("/networth")
public class NetworthController {

    @Autowired
    private NetworthService netWorthService;

    @PostMapping("/add")
    @ResponseBody
    public String addEntry(
        @RequestBody Map<String, Object> payload,
        HttpSession session
    ) {
        UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");
        if (loggedInUser == null) {
            throw new RuntimeException("User not logged in");
        }

        String name = (String) payload.get("name");
        BigDecimal value = new BigDecimal(String.valueOf(payload.get("value")));
        String type = (String) payload.get("type");

        if (name == null || value == null || type == null) {
            throw new IllegalArgumentException("Invalid input data.");
        }

        netWorthService.addEntry(name, value, type, loggedInUser);
        return type.equals("asset") ? "Asset added successfully!" : "Debt added successfully!";
    }

    @GetMapping("/current-month-assets")
    @ResponseBody
    public List<NetworthEntity> getCurrentMonthAssets(HttpSession session) {
        UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");
        if (loggedInUser == null) {
            throw new RuntimeException("User not logged in");
        }
        return netWorthService.getCurrentMonthAssets(loggedInUser);
    }

    @GetMapping("/current-month-debts")
    @ResponseBody
    public List<NetworthEntity> getCurrentMonthDebts(HttpSession session) {
        UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");
        if (loggedInUser == null) {
            throw new RuntimeException("User not logged in");
        }
        return netWorthService.getCurrentMonthDebts(loggedInUser);
    }

    @DeleteMapping("/delete/{id}")
    @ResponseBody
    public String deleteEntry(@PathVariable Long id, HttpSession session) {
        UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");
        if (loggedInUser == null) {
            throw new RuntimeException("User not logged in");
        }

        netWorthService.deleteEntry(id);
        return "Entry deleted successfully!";
}
}
