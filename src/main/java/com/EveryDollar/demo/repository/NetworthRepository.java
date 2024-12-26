package com.EveryDollar.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.EveryDollar.demo.entity.NetworthEntity;
import com.EveryDollar.demo.entity.UserEntity;

public interface NetworthRepository extends JpaRepository<NetworthEntity, Long> {
    List<NetworthEntity> findByUserAndType(UserEntity user, String type);

    @Query("SELECT n FROM NetworthEntity n WHERE n.user = :user AND n.type = 'asset' AND MONTH(n.createdAt) = :month AND YEAR(n.createdAt) = :year")
    List<NetworthEntity> findCurrentMonthAssets(@Param("user") UserEntity user, @Param("month") int month, @Param("year") int year);

    @Query("SELECT n FROM NetworthEntity n WHERE n.user = :user AND n.type = 'debt' AND MONTH(n.createdAt) = :month AND YEAR(n.createdAt) = :year")
    List<NetworthEntity> findCurrentMonthDebts(@Param("user") UserEntity user, @Param("month") int month, @Param("year") int year);

}
