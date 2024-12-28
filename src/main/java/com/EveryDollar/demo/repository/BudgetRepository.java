package com.EveryDollar.demo.repository;

import com.EveryDollar.demo.entity.BudgetEntity;
import com.EveryDollar.demo.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface BudgetRepository extends JpaRepository<BudgetEntity, Long> {
    List<BudgetEntity> findByUser(UserEntity user);

    @Query("SELECT b FROM BudgetEntity b WHERE b.user = :user AND MONTH(b.createdAt) = :month AND YEAR(b.createdAt) = :year")
    List<BudgetEntity> findCurrentMonthIncomeSources(@Param("user") UserEntity user, @Param("month") int month, @Param("year") int year);

    @Query("SELECT SUM(b.amount) FROM BudgetEntity b WHERE b.user = :user AND MONTH(b.createdAt) = :month AND YEAR(b.createdAt) = :year")
    BigDecimal getTotalIncomeForCurrentMonth(@Param("user") UserEntity user, @Param("month") int month, @Param("year") int year);

}

