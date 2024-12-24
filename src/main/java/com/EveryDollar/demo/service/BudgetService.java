package com.EveryDollar.demo.service;

import com.EveryDollar.demo.dto.BudgetDTO;
import com.EveryDollar.demo.entity.BudgetEntity;
import com.EveryDollar.demo.entity.UserEntity;
import com.EveryDollar.demo.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
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

    public BigDecimal getTotalIncome(UserEntity user) {
        return budgetRepository.findByUser(user).stream()
                .map(BudgetEntity::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public List<BudgetEntity> getAllIncomeSources(UserEntity user) {
        return budgetRepository.findByUser(user);
    }
}
