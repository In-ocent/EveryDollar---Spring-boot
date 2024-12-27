package com.EveryDollar.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.EveryDollar.demo.entity.GoalsEntity;
import com.EveryDollar.demo.entity.UserEntity;
import com.EveryDollar.demo.repository.GoalsRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class GoalsService {

    @Autowired
    private GoalsRepository goalRepository;

    public void addGoal(String name, LocalDate date, int targetValue, int progressValue, UserEntity user) {
        GoalsEntity goal = new GoalsEntity();
        goal.setName(name);
        goal.setDate(date);
        goal.setTargetValue(targetValue);
        goal.setProgressValue(progressValue);
        goal.setUser(user);
        goalRepository.save(goal);
    }

    public void updateProgress(String name, int progressValue, UserEntity user) {
        GoalsEntity goal = goalRepository.findByNameAndUser(name, user);
        if (goal == null) {
            throw new RuntimeException("Goal not found for the user.");
        }
        goal.setProgressValue(progressValue);
        goalRepository.save(goal);
    }

    public List<GoalsEntity> getCurrentMonthGoals(UserEntity user) {
        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();
        return goalRepository.findCurrentMonthGoals(user, currentMonth, currentYear);
    }

    public void deleteGoal(String name, UserEntity user) {
        GoalsEntity goal = goalRepository.findByNameAndUser(name, user);
        if (goal == null) {
            throw new RuntimeException("Goal not found for the user.");
        }
        goalRepository.delete(goal);
    }
}
