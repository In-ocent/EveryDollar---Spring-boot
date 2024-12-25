package com.EveryDollar.demo.service;

import java.math.BigDecimal;
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

    public List<NetworthEntity> getAssets(UserEntity user) {
        return networthRepository.findByUserAndType(user, "asset");
    }

    public List<NetworthEntity> getDebts(UserEntity user) {
        return networthRepository.findByUserAndType(user, "debt");
    }

    public NetworthEntity addEntry(String name, BigDecimal value, String type, UserEntity user) {
        NetworthEntity entry = new NetworthEntity();
        entry.setName(name);
        entry.setValue(value);
        entry.setType(type);
        entry.setUser(user);
        return networthRepository.save(entry);
    }
}
