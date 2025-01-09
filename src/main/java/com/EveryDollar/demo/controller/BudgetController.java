package com.EveryDollar.demo.controller;

import com.EveryDollar.demo.dto.BudgetDTO;
import com.EveryDollar.demo.entity.BudgetEntity;
import com.EveryDollar.demo.entity.EssentialExpensesEntity;
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
import java.util.Map;

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
            return "redirect:/User_login/login.html";
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

    @DeleteMapping("/remove/{id}")
    @ResponseBody
    public String removeIncome(@PathVariable Long id, HttpSession session) {
        UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");
        if (loggedInUser == null) {
            throw new RuntimeException("User not logged in");
        }

        boolean isRemoved = budgetService.removeIncome(id, loggedInUser);
        if (isRemoved) {
            return "Income removed successfully!";
        } else {
            throw new RuntimeException("Failed to remove income. Income may not exist or does not belong to the logged-in user.");
        }
    }

    @GetMapping("/current-month-income-sources")
    @ResponseBody
    public List<BudgetEntity> getCurrentMonthIncomeSources(HttpSession session) {
        UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");
        if (loggedInUser == null) {
            throw new RuntimeException("User not logged in");
        }
        return budgetService.getCurrentMonthIncomeSources(loggedInUser);
    }

    @GetMapping("/current-month-total-income")
    @ResponseBody
    public BigDecimal getCurrentMonthTotalIncome(HttpSession session) {
        UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");
        if (loggedInUser == null) {
            throw new RuntimeException("User not logged in");
        }
        return budgetService.getCurrentMonthTotalIncome(loggedInUser);
    }


    @GetMapping("/essential-expenses")
    @ResponseBody
    public List<EssentialExpensesEntity> getEssentialExpenses(HttpSession session) {
        UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");

        if (loggedInUser == null) {
            throw new RuntimeException("User not logged in");
        }

        budgetService.loadEssentialExpensesFromDatabase(loggedInUser);
        return budgetService.getEssentialExpenses();
    }

    @PostMapping("/essential-expenses")
    @ResponseBody
    public String addEssentialExpense(@RequestBody Map<String, Object> expenseData, HttpSession session) {
        UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");

        if (loggedInUser == null) {
            throw new RuntimeException("User not logged in");
        }

        String name = (String) expenseData.get("name");
        BigDecimal amount = new BigDecimal(expenseData.get("amount").toString());

        return budgetService.addEssentialExpense(name, amount, loggedInUser);
    }

    @DeleteMapping("/essential-expenses/{id}")
    @ResponseBody
    public String deleteEssentialExpense(@PathVariable Long id, HttpSession session) {
        UserEntity loggedInUser = (UserEntity) session.getAttribute("loggedInUser");

        if (loggedInUser == null) {
            throw new RuntimeException("User not logged in");
        }

        return budgetService.deleteEssentialExpense(id, loggedInUser);
    }



    private Expense[] optionalSpending = new Expense[20]; 
    private int optionalSpendingIndex = -1; 

    @GetMapping("/optional-spending")
    @ResponseBody
    public Expense[] getOptionalSpending() {
        return optionalSpending;
    }

    @PostMapping("/optional-spending")
    @ResponseBody
    public String addOptionalSpending(@RequestBody Expense expense) {
        return push(expense);
    }

    private String push(Expense expense) {
        if (optionalSpendingIndex < optionalSpending.length - 1) {
            optionalSpending[++optionalSpendingIndex] = expense;
            return "Optional spending item added successfully!";
        }
        return "Optional spending array is full!";
    }

    @DeleteMapping("/optional-spending")
    @ResponseBody
    public String removeLastOptionalSpending() {
        return pop();
    }

    private String pop() {
        if (optionalSpendingIndex >= 0) {
            optionalSpending[optionalSpendingIndex--] = null; 
            return "Last optional spending item removed successfully!";
        }
        return "No items to remove!";
    }

    public static class Expense {
        private String name;
        private double amount;

        public Expense() {
        }

        public Expense(String name, double amount) {
            this.name = name;
            this.amount = amount;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public double getAmount() {
            return amount;
        }

        public void setAmount(double amount) {
            this.amount = amount;
        }

        @Override
        public String toString() {
            return "Expense{name='" + name + "', amount=" + amount + "}";
        }
    }
}
