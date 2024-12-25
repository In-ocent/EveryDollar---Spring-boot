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
import java.util.ArrayList;
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


    // Essential expense and optional spending data structures implementation

    private List<Expense> essentialExpenses = new ArrayList<>();
    
    // Array to store optional spending
    private Expense[] optionalSpending = new Expense[100]; // Example max size of 100
    private int optionalSpendingIndex = -1; // Stack pointer for the array

    // Endpoint to get all essential expenses
    @GetMapping("/essential-expenses")
    @ResponseBody
    public List<Expense> getEssentialExpenses() {
        return essentialExpenses;
    }

    // Endpoint to add an essential expense
    @PostMapping("/essential-expenses")
    @ResponseBody
    public String addEssentialExpense(@RequestBody Expense expense) {
        essentialExpenses.add(expense);
        return "Essential expense added successfully!";
    }

    // Endpoint to delete an essential expense
    @DeleteMapping("/essential-expenses/{index}")
    @ResponseBody
    public String deleteEssentialExpense(@PathVariable int index) {
        if (index >= 0 && index < essentialExpenses.size()) {
            essentialExpenses.remove(index);
            return "Essential expense removed successfully!";
        }
        return "Invalid index!";
    }

    // Endpoint to get all optional spending
    @GetMapping("/optional-spending")
    @ResponseBody
    public Expense[] getOptionalSpending() {
        return optionalSpending;
    }

    // Endpoint to add an optional spending item
    @PostMapping("/optional-spending")
    @ResponseBody
    public String addOptionalSpending(@RequestBody Expense expense) {
        return push(expense);
    }

    // Push function to simulate stack behavior
    private String push(Expense expense) {
        if (optionalSpendingIndex < optionalSpending.length - 1) {
            optionalSpending[++optionalSpendingIndex] = expense;
            return "Optional spending item added successfully!";
        }
        return "Optional spending array is full!";
    }

    // Endpoint to remove the last optional spending item (stack behavior)
    @DeleteMapping("/optional-spending")
    @ResponseBody
    public String removeLastOptionalSpending() {
        return pop();
    }

    private String pop() {
        if (optionalSpendingIndex >= 0) {
            optionalSpending[optionalSpendingIndex--] = null; // Remove the last item
            return "Last optional spending item removed successfully!";
        }
        return "No items to remove!";
    }

    // Expense class (nested or as a separate file)
    public static class Expense {
        private String name;
        private double amount;

        // Constructors
        public Expense() {
        }

        public Expense(String name, double amount) {
            this.name = name;
            this.amount = amount;
        }

        // Getters and setters
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
