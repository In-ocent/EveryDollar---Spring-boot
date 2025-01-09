package com.EveryDollar.demo.service;

import com.EveryDollar.demo.dto.BudgetDTO;
import com.EveryDollar.demo.entity.BudgetEntity;
import com.EveryDollar.demo.entity.EssentialExpensesEntity;
import com.EveryDollar.demo.entity.UserEntity;
import com.EveryDollar.demo.repository.BudgetRepository;
import com.EveryDollar.demo.repository.EssentialExpensesRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    public BudgetEntity addIncome(BudgetDTO budgetDTO, UserEntity user) {
        BudgetEntity budget = new BudgetEntity();
        budget.setSourceName(budgetDTO.getSourceName());
        budget.setAmount(budgetDTO.getAmount());
        budget.setUser(user);
        return budgetRepository.save(budget);
    }
    
    public boolean removeIncome(Long id, UserEntity user) {
        BudgetEntity income = budgetRepository.findById(id).orElse(null);
        if (income != null && income.getUser().getId().equals(user.getId())) {
            budgetRepository.delete(income);
            return true;
        }
        return false;
    }

    public List<BudgetEntity> getCurrentMonthIncomeSources(UserEntity user) {
        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();
        return budgetRepository.findCurrentMonthIncomeSources(user, currentMonth, currentYear);
    }

    public BigDecimal getCurrentMonthTotalIncome(UserEntity user) {
        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();
        BigDecimal totalIncome = budgetRepository.getTotalIncomeForCurrentMonth(user, currentMonth, currentYear);
        return totalIncome != null ? totalIncome : BigDecimal.ZERO;
    }


    @Autowired
    private EssentialExpensesRepository essentialExpensesRepository;

    private List<EssentialExpensesEntity> essentialExpenses = new ArrayList<>();

    public void loadEssentialExpensesFromDatabase(UserEntity user) {
        essentialExpenses = essentialExpensesRepository.findUserEssentialExpenses(user);
    }

    public List<EssentialExpensesEntity> getEssentialExpenses() {
        return essentialExpenses;
    }

    public String addEssentialExpense(String name, BigDecimal amount, UserEntity user) {
        EssentialExpensesEntity expense = new EssentialExpensesEntity();
        expense.setName(name);
        expense.setAmount(amount);
        expense.setUser(user);

        essentialExpenses.add(expense);

        essentialExpensesRepository.save(expense);
        return "Essential expense added successfully!";
    }

    public String deleteEssentialExpense(Long id, UserEntity user) {
        EssentialExpensesEntity expense = essentialExpenses.stream()
                .filter(e -> e.getId().equals(id) && e.getUser().getId().equals(user.getId()))
                .findFirst()
                .orElse(null);

        if (expense != null) {
            essentialExpenses.remove(expense);

            essentialExpensesRepository.delete(expense);
            return "Essential expense removed successfully!";
        }
        return "Expense not found or does not belong to the user.";
    }
}
