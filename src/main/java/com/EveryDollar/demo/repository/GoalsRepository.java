package com.EveryDollar.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.EveryDollar.demo.entity.GoalsEntity;
import com.EveryDollar.demo.entity.UserEntity;

import java.util.List;

public interface GoalsRepository extends JpaRepository<GoalsEntity, Long> {
    List<GoalsEntity> findByUser(UserEntity user);

    GoalsEntity findByNameAndUser(String name, UserEntity user);
}
