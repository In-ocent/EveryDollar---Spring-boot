package com.EveryDollar.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.EveryDollar.demo.entity.NetworthEntity;
import com.EveryDollar.demo.entity.UserEntity;

public interface NetworthRepository extends JpaRepository<NetworthEntity, Long> {
    List<NetworthEntity> findByUserAndType(UserEntity user, String type);
}
