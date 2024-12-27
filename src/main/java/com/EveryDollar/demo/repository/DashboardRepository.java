package com.EveryDollar.demo.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.EveryDollar.demo.entity.NetworthEntity;
import com.EveryDollar.demo.entity.UserEntity;

public interface DashboardRepository extends JpaRepository<NetworthEntity, Long> {

    @Query("SELECT n.name, n.value FROM NetworthEntity n WHERE n.user = :user AND n.type = 'asset' AND MONTH(n.createdAt) = :month AND YEAR(n.createdAt) = :year")
    List<Object[]> getCurrentMonthAssets(@Param("user") UserEntity user, @Param("month") int month, @Param("year") int year);

    @Query("SELECT n.name, n.value FROM NetworthEntity n WHERE n.user = :user AND n.type = 'debt' AND MONTH(n.createdAt) = :month AND YEAR(n.createdAt) = :year")
    List<Object[]> getCurrentMonthDebts(@Param("user") UserEntity user, @Param("month") int month, @Param("year") int year);

    @Query("SELECT SUM(n.value) FROM NetworthEntity n WHERE n.user = :user AND n.type = 'asset' AND MONTH(n.createdAt) = :month AND YEAR(n.createdAt) = :year")
    BigDecimal getTotalCurrentMonthAssets(@Param("user") UserEntity user, @Param("month") int month, @Param("year") int year);

    @Query("SELECT SUM(n.value) FROM NetworthEntity n WHERE n.user = :user AND n.type = 'debt' AND MONTH(n.createdAt) = :month AND YEAR(n.createdAt) = :year")
    BigDecimal getTotalCurrentMonthDebts(@Param("user") UserEntity user, @Param("month") int month, @Param("year") int year);


    @Query("SELECT m.month, COALESCE(SUM(n.value), 0) " +
    "FROM MonthEntity m " +
    "LEFT JOIN NetworthEntity n ON MONTH(n.createdAt) = m.month " +
    "AND n.user = :user AND n.type = 'asset' " +
    "GROUP BY m.month " +
    "ORDER BY m.month")
    List<Object[]> getMonthlyAssets(@Param("user") UserEntity user);

    @Query("SELECT m.month, COALESCE(SUM(n.value), 0) " +
        "FROM MonthEntity m " +
        "LEFT JOIN NetworthEntity n ON MONTH(n.createdAt) = m.month " +
        "AND n.user = :user AND n.type = 'debt' " +
        "GROUP BY m.month " +
        "ORDER BY m.month")
    List<Object[]> getMonthlyDebts(@Param("user") UserEntity user);

    @Query("SELECT m.month, COALESCE(SUM(CASE WHEN n.type = 'asset' THEN n.value ELSE -n.value END), 0) " +
        "FROM MonthEntity m " +
        "LEFT JOIN NetworthEntity n ON MONTH(n.createdAt) = m.month " +
        "AND n.user = :user " +
        "GROUP BY m.month " +
        "ORDER BY m.month")
    List<Object[]> getMonthlyNetWorth(@Param("user") UserEntity user);

}
