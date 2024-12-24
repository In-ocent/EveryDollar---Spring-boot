package com.EveryDollar.demo.controller;

import com.EveryDollar.demo.dto.BudgetDTO;
import com.EveryDollar.demo.entity.BudgetEntity;
import com.EveryDollar.demo.entity.UserEntity;
import com.EveryDollar.demo.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.DayOfWeek;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Controller
@RequestMapping("/budget")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @GetMapping("/")
    public String renderBudget(HttpSession session, Model model) {
        UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");

        if (loggedInUser != null) {
            model.addAttribute("username", loggedInUser.getUsername());

            LocalDate currentDate = LocalDate.now();
            DayOfWeek currentDay = currentDate.getDayOfWeek();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy", Locale.ENGLISH);

            model.addAttribute("currentDay", currentDay.name());
            model.addAttribute("currentDate", currentDate.format(formatter));

            return "Budget/index";
        } else {
            return "redirect:/User_login/login";
        }
    }

    @PostMapping("/add")
    @ResponseBody
    public BudgetEntity addIncome(@RequestBody BudgetDTO budgetDTO, HttpSession session) {
        UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");
        if (loggedInUser == null) {
            throw new RuntimeException("User not logged in");
        }
        return budgetService.addIncome(budgetDTO, loggedInUser);
    }

    @GetMapping("/total-income")
    @ResponseBody
    public BigDecimal getTotalIncome(HttpSession session) {
        UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");
        if (loggedInUser == null) {
            throw new RuntimeException("User not logged in");
        }
        return budgetService.getTotalIncome(loggedInUser);
    }

    @GetMapping("/income-sources")
    @ResponseBody
    public List<BudgetEntity> getAllIncomeSources(HttpSession session) {
        UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");
        if (loggedInUser == null) {
            throw new RuntimeException("User not logged in");
        }
        return budgetService.getAllIncomeSources(loggedInUser);
    }
}
