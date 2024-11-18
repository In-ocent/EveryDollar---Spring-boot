package com.EveryDollar.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.EveryDollar.demo.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    boolean existsByEmailAddress(String emailAddress);
    boolean existsByUsername(String username);
}
