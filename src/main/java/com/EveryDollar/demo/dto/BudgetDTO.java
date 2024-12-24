package com.EveryDollar.demo.dto;

import java.math.BigDecimal;

public class BudgetDTO {

    private String sourceName;
    private BigDecimal amount;

    // Getters and Setters
    public String getSourceName() {
        return sourceName;
    }

    public void setSourceName(String sourceName) {
        this.sourceName = sourceName;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
