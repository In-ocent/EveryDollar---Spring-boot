package com.EveryDollar.demo.repository;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.EveryDollar.demo.entity.GoalsEntity;
import com.EveryDollar.demo.entity.UserEntity;

import java.util.List;

public interface GoalsRepository extends JpaRepository<GoalsEntity, Long> {
    List<GoalsEntity> findByUser(UserEntity user);

    GoalsEntity findByNameAndUser(String name, UserEntity user);

    @Query("SELECT g FROM GoalsEntity g WHERE g.user = :user AND MONTH(g.createdAt) = :month AND YEAR(g.createdAt) = :year")
    List<GoalsEntity> findCurrentMonthGoals(@Param("user") UserEntity user, @Param("month") int month, @Param("year") int year);

    // Fetch First Two Goals
    @Query("SELECT g FROM GoalsEntity g WHERE g.user = :user AND MONTH(g.createdAt) = :month AND YEAR(g.createdAt) = :year ORDER BY g.createdAt ASC")
    List<GoalsEntity> findByUserOrderByDateAsc(@Param("user") UserEntity user, @Param("month") int month, @Param("year") int year, PageRequest pageable);
}
