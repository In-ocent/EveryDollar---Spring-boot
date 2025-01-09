package com.EveryDollar.demo.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.EveryDollar.demo.entity.UserEntity;
import com.EveryDollar.demo.repository.ReportRepository;

@Service
public class ReportService {
    
    @Autowired
    private ReportRepository reportRepository;

    public Map<String, Object> generateMonthlyReport(UserEntity user, int month) {
        Map<String, Object> reportData = new HashMap<>();
        int currentMonth = LocalDate.now().getMonthValue();

        Double monthlyIncome = reportRepository.getMonthlyIncome(user, month);
        reportData.put("monthlyIncome", monthlyIncome != null ? monthlyIncome : 0.0);

        Double essentialExpenses = reportRepository.getEssentialExpenses(user, month);
        reportData.put("essentialExpenses", essentialExpenses != null ? essentialExpenses : 0.0);

        Double optionalExpenses = reportRepository.getOptionalExpenses(user, month);
        reportData.put("optionalExpenses", optionalExpenses != null ? optionalExpenses : 0.0);

        double totalExpenses = (essentialExpenses != null ? essentialExpenses : 0.0) +
                               (optionalExpenses != null ? optionalExpenses : 0.0);
        reportData.put("totalExpenses", totalExpenses);

        BigDecimal totalAssets = reportRepository.getTotalAssets(user);
        reportData.put("totalAssets", totalAssets != null ? totalAssets : BigDecimal.ZERO);

        BigDecimal totalDebts = reportRepository.getTotalDebts(user);
        reportData.put("totalDebts", totalDebts != null ? totalDebts : BigDecimal.ZERO);

        if (month == currentMonth) {
            Long achievedGoals = reportRepository.countAchievedGoals(user);
            Long totalGoals = reportRepository.countTotalGoals(user);
            reportData.put("achievedGoals", achievedGoals != null ? achievedGoals : 0);
            reportData.put("totalGoals", totalGoals != null ? totalGoals : 0);
        } else {
            reportData.put("achievedGoals", 0);
            reportData.put("totalGoals", 0);
        }

        BigDecimal monthlyAssets = reportRepository.getMonthlyAssets(user, month);
        BigDecimal monthlyDebts = reportRepository.getMonthlyDebts(user, month);

        BigDecimal netWorth = (monthlyAssets != null ? monthlyAssets : BigDecimal.ZERO)
                                .subtract(monthlyDebts != null ? monthlyDebts : BigDecimal.ZERO);
        reportData.put("netWorth", netWorth);

        reportData.put("month", LocalDate.now().withMonth(month).getMonth().toString());

        return reportData;
    }
}
