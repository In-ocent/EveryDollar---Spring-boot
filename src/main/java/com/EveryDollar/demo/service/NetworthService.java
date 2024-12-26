package com.EveryDollar.demo.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.EveryDollar.demo.entity.NetworthEntity;
import com.EveryDollar.demo.entity.UserEntity;
import com.EveryDollar.demo.repository.NetworthRepository;

@Service
public class NetworthService {
    @Autowired
    private NetworthRepository networthRepository;

    public List<NetworthEntity> getCurrentMonthAssets(UserEntity user) {
        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();
        return networthRepository.findCurrentMonthAssets(user, currentMonth, currentYear);
    }

    public List<NetworthEntity> getCurrentMonthDebts(UserEntity user) {
        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();
        return networthRepository.findCurrentMonthDebts(user, currentMonth, currentYear);
    }

    public NetworthEntity addEntry(String name, BigDecimal value, String type, UserEntity user) {
        NetworthEntity entry = new NetworthEntity();
        entry.setName(name);
        entry.setValue(value);
        entry.setType(type);
        entry.setUser(user);
        entry.setCreatedAt(LocalDateTime.now()); // Set createdAt field
        return networthRepository.save(entry);
    }
}
