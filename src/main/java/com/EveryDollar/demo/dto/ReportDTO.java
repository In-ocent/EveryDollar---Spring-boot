package com.EveryDollar.demo.dto;

public class ReportDTO {
    private int month;
    private double monthlyIncome;
    private double essentialExpenses;
    private double optionalExpenses;
    private double totalExpenses;
    private double netWorth;
    private long goalsAchieved;
    private long totalGoals;

    
    public int getMonth() {
        return month;
    }
    public void setMonth(int month) {
        this.month = month;
    }
    public double getMonthlyIncome() {
        return monthlyIncome;
    }
    public void setMonthlyIncome(double monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }
    public double getEssentialExpenses() {
        return essentialExpenses;
    }
    public void setEssentialExpenses(double essentialExpenses) {
        this.essentialExpenses = essentialExpenses;
    }
    public double getOptionalExpenses() {
        return optionalExpenses;
    }
    public void setOptionalExpenses(double optionalExpenses) {
        this.optionalExpenses = optionalExpenses;
    }
    public double getTotalExpenses() {
        return totalExpenses;
    }
    public void setTotalExpenses(double totalExpenses) {
        this.totalExpenses = totalExpenses;
    }
    public double getNetWorth() {
        return netWorth;
    }
    public void setNetWorth(double netWorth) {
        this.netWorth = netWorth;
    }
    public long getGoalsAchieved() {
        return goalsAchieved;
    }
    public void setGoalsAchieved(long goalsAchieved) {
        this.goalsAchieved = goalsAchieved;
    }
    public long getTotalGoals() {
        return totalGoals;
    }
    public void setTotalGoals(long totalGoals) {
        this.totalGoals = totalGoals;
    }


}
