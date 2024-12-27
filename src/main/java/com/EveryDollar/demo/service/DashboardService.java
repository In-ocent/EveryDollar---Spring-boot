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
import com.EveryDollar.demo.repository.DashboardRepository;
import com.EveryDollar.demo.repository.GoalsRepository;
import com.EveryDollar.demo.repository.ReportRepository;

@Service
public class DashboardService {

    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private GoalsRepository goalsRepository;
    @Autowired
    private DashboardRepository dashboardRepository;

    public Map<String, Object> getDashboardData(UserEntity user) {
        Map<String, Object> dashboardData = new HashMap<>();

        // Get current month and year
        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();

        // Fetch total assets for the current month
        BigDecimal totalCurrentMonthAssets = dashboardRepository.getTotalCurrentMonthAssets(user, currentMonth, currentYear);
        dashboardData.put("totalCurrentMonthAssets", totalCurrentMonthAssets != null ? totalCurrentMonthAssets : BigDecimal.ZERO);

        // Fetch total debts for the current month
        BigDecimal totalCurrentMonthDebts = dashboardRepository.getTotalCurrentMonthDebts(user, currentMonth, currentYear);
        dashboardData.put("totalCurrentMonthDebts", totalCurrentMonthDebts != null ? totalCurrentMonthDebts : BigDecimal.ZERO);

        // Fetch current month's asset details
        List<Object[]> currentMonthAssetDetails = dashboardRepository.getCurrentMonthAssets(user, currentMonth, currentYear);
        List<Map<String, Object>> formattedAssetDetails = currentMonthAssetDetails.stream()
            .map(obj -> Map.of("name", obj[0], "value", obj[1]))
            .toList();
        dashboardData.put("currentMonthAssetDetails", formattedAssetDetails.isEmpty() ? List.of() : formattedAssetDetails);

        // Fetch current month's debt details
        List<Object[]> currentMonthDebtDetails = dashboardRepository.getCurrentMonthDebts(user, currentMonth, currentYear);
        List<Map<String, Object>> formattedDebtDetails = currentMonthDebtDetails.stream()
            .map(obj -> Map.of("name", obj[0], "value", obj[1]))
            .toList();
        dashboardData.put("currentMonthDebtDetails", formattedDebtDetails.isEmpty() ? List.of() : formattedDebtDetails);

        
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
        List<GoalsEntity> goals = goalsRepository.findByUserOrderByDateAsc(user, currentMonth, currentYear, PageRequest.of(0, 2));
        dashboardData.put("goals", goals);


        return dashboardData;
    }
}
