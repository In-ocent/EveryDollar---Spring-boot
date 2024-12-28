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

    /**
     * Generate a financial report for the given user and month.
     *
     * @param user  The logged-in user.
     * @param month The month for which the report is generated (1 = January, ..., 12 = December).
     * @return A map containing the financial report details.
     */
    public Map<String, Object> generateMonthlyReport(UserEntity user, int month) {
        Map<String, Object> reportData = new HashMap<>();
        int currentMonth = LocalDate.now().getMonthValue();

        // Fetch monthly income
        Double monthlyIncome = reportRepository.getMonthlyIncome(user, month);
        reportData.put("monthlyIncome", monthlyIncome != null ? monthlyIncome : 0.0);

        // Fetch essential expenses
        Double essentialExpenses = reportRepository.getEssentialExpenses(user, month);
        reportData.put("essentialExpenses", essentialExpenses != null ? essentialExpenses : 0.0);

        // Fetch optional expenses
        Double optionalExpenses = reportRepository.getOptionalExpenses(user, month);
        reportData.put("optionalExpenses", optionalExpenses != null ? optionalExpenses : 0.0);

        // Calculate total expenses
        double totalExpenses = (essentialExpenses != null ? essentialExpenses : 0.0) +
                               (optionalExpenses != null ? optionalExpenses : 0.0);
        reportData.put("totalExpenses", totalExpenses);

        // Fetch total assets
        BigDecimal totalAssets = reportRepository.getTotalAssets(user);
        reportData.put("totalAssets", totalAssets != null ? totalAssets : BigDecimal.ZERO);

        // Fetch total debts
        BigDecimal totalDebts = reportRepository.getTotalDebts(user);
        reportData.put("totalDebts", totalDebts != null ? totalDebts : BigDecimal.ZERO);

         // Fetch goals' progress only for the current month
        if (month == currentMonth) {
            Long achievedGoals = reportRepository.countAchievedGoals(user);
            Long totalGoals = reportRepository.countTotalGoals(user);
            reportData.put("achievedGoals", achievedGoals != null ? achievedGoals : 0);
            reportData.put("totalGoals", totalGoals != null ? totalGoals : 0);
        } else {
            reportData.put("achievedGoals", 0);
            reportData.put("totalGoals", 0);
        }

        // Calculate net worth
        BigDecimal monthlyAssets = reportRepository.getMonthlyAssets(user, month);
        BigDecimal monthlyDebts = reportRepository.getMonthlyDebts(user, month);

        // Calculate net worth
        BigDecimal netWorth = (monthlyAssets != null ? monthlyAssets : BigDecimal.ZERO)
                                .subtract(monthlyDebts != null ? monthlyDebts : BigDecimal.ZERO);
        reportData.put("netWorth", netWorth);

        // Add month information
        reportData.put("month", LocalDate.now().withMonth(month).getMonth().toString());

        return reportData;
    }
}
