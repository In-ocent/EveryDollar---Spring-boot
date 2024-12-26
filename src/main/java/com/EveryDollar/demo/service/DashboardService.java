package com.EveryDollar.demo.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.EveryDollar.demo.entity.GoalsEntity;
import com.EveryDollar.demo.entity.UserEntity;
import com.EveryDollar.demo.repository.GoalsRepository;
import com.EveryDollar.demo.repository.ReportRepository;

@Service
public class DashboardService {

    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private GoalsRepository goalsRepository;

    public Map<String, Object> getDashboardData(UserEntity user) {
        Map<String, Object> dashboardData = new HashMap<>();

        // Fetch total assets
        BigDecimal totalAssets = reportRepository.getTotalAssets(user);
        dashboardData.put("totalAssets", totalAssets != null ? totalAssets : BigDecimal.ZERO);

        // Fetch total debts
        BigDecimal totalDebts = reportRepository.getTotalDebts(user);
        dashboardData.put("totalDebts", totalDebts != null ? totalDebts : BigDecimal.ZERO);

        // Fetch asset details
        List<Object[]> assetDetails = reportRepository.getAssetTypesWithValues(user);
        List<Map<String, Object>> formattedAssetDetails = assetDetails.stream()
            .map(obj -> Map.of("name", obj[0], "value", obj[1]))
            .toList();
        dashboardData.put("assetDetails", formattedAssetDetails.isEmpty() ? List.of() : formattedAssetDetails);

        // Fetch debt details
        List<Object[]> debtDetails = reportRepository.getDebtTypesWithValues(user);
        List<Map<String, Object>> formattedDebtDetails = debtDetails.stream()
            .map(obj -> Map.of("name", obj[0], "value", obj[1]))
            .toList();
        dashboardData.put("debtDetails", formattedDebtDetails.isEmpty() ? List.of() : formattedDebtDetails);

        // Fetch monthly income
        Double monthlyIncome = reportRepository.getMonthlyIncome(user, LocalDate.now().getMonthValue());
        dashboardData.put("monthlyIncome", monthlyIncome != null ? monthlyIncome : 0.0);

        // Fetch total spending (essential + optional expenses)
        Double essentialExpenses = reportRepository.getEssentialExpenses(user, LocalDate.now().getMonthValue());
        Double optionalExpenses = reportRepository.getOptionalExpenses(user, LocalDate.now().getMonthValue());
        double totalSpending = (essentialExpenses != null ? essentialExpenses : 0.0) +
                                (optionalExpenses != null ? optionalExpenses : 0.0);
        dashboardData.put("totalSpending", totalSpending);

        // Fetch the first two goals
        List<GoalsEntity> goals = goalsRepository.findByUserOrderByDateAsc(user, PageRequest.of(0, 2));
        dashboardData.put("goals", goals);

        return dashboardData;
    }
}
