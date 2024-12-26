package com.EveryDollar.demo.service;

import com.EveryDollar.demo.dto.BudgetDTO;
import com.EveryDollar.demo.entity.BudgetEntity;
import com.EveryDollar.demo.entity.UserEntity;
import com.EveryDollar.demo.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
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
    

    public BigDecimal getTotalIncome(UserEntity user) {
        return budgetRepository.findByUser(user).stream()
                .map(BudgetEntity::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public List<BudgetEntity> getAllIncomeSources(UserEntity user) {
        return budgetRepository.findByUser(user);
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
}
