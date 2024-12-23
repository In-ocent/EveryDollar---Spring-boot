package com.EveryDollar.demo.dto;

public class DashboardDTO {
    private String username;

    public DashboardDTO(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
