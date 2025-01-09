package com.EveryDollar.demo.repository;

import com.EveryDollar.demo.entity.EssentialExpensesEntity;
import com.EveryDollar.demo.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EssentialExpensesRepository extends JpaRepository<EssentialExpensesEntity, Long> {

    @Query("SELECT e FROM EssentialExpensesEntity e WHERE e.user = :user")
    List<EssentialExpensesEntity> findUserEssentialExpenses(@Param("user") UserEntity user);
}
