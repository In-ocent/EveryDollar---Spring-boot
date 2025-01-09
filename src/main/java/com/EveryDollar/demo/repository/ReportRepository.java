package com.EveryDollar.demo.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.EveryDollar.demo.entity.BudgetEntity;
import com.EveryDollar.demo.entity.UserEntity;

@Repository
public interface ReportRepository extends JpaRepository<BudgetEntity, Long> {

    @Query("SELECT SUM(b.amount) FROM BudgetEntity b WHERE b.user = :user AND MONTH(b.createdAt) = :month")
    Double getMonthlyIncome(@Param("user") UserEntity user, @Param("month") int month);

    @Query("SELECT SUM(n.value) FROM NetworthEntity n WHERE n.user = :user AND n.type = 'asset' AND MONTH(n.createdAt) = :month")
    BigDecimal getMonthlyAssets(@Param("user") UserEntity user, @Param("month") int month);

    @Query("SELECT SUM(n.value) FROM NetworthEntity n WHERE n.user = :user AND n.type = 'debt' AND MONTH(n.createdAt) = :month")
    BigDecimal getMonthlyDebts(@Param("user") UserEntity user, @Param("month") int month);

    @Query("SELECT SUM(b.amount) FROM BudgetEntity b WHERE b.user = :user AND MONTH(b.createdAt) = :month AND b.sourceName = 'essential'")
    Double getEssentialExpenses(@Param("user") UserEntity user, @Param("month") int month);

    @Query("SELECT SUM(b.amount) FROM BudgetEntity b WHERE b.user = :user AND MONTH(b.createdAt) = :month AND b.sourceName = 'optional'")
    Double getOptionalExpenses(@Param("user") UserEntity user, @Param("month") int month);

    @Query("SELECT SUM(n.value) FROM NetworthEntity n WHERE n.user = :user AND n.type = 'asset'")
    BigDecimal getTotalAssets(@Param("user") UserEntity user);

    @Query("SELECT SUM(n.value) FROM NetworthEntity n WHERE n.user = :user AND n.type = 'debt'")
    BigDecimal getTotalDebts(@Param("user") UserEntity user);

    @Query("SELECT COUNT(g) FROM GoalsEntity g WHERE g.user = :user AND g.progressValue >= g.targetValue")
    Long countAchievedGoals(@Param("user") UserEntity user);

    @Query("SELECT COUNT(g) FROM GoalsEntity g WHERE g.user = :user")
    Long countTotalGoals(@Param("user") UserEntity user);

    @Query("SELECT n.name, n.value FROM NetworthEntity n WHERE n.user = :user AND n.type = 'asset'")
    List<Object[]> getAssetTypesWithValues(@Param("user") UserEntity user);

    @Query("SELECT n.name, n.value FROM NetworthEntity n WHERE n.user = :user AND n.type = 'debt'")
    List<Object[]> getDebtTypesWithValues(@Param("user") UserEntity user);

}
