package com.ecomarket.dto;

import java.math.BigDecimal;

public class DashboardStatsDTO {
    private long totalUsers;
    private long totalSellers;
    private long totalProducts;
    private long pendingProducts;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private SustainabilityImpactDTO impact;

    public DashboardStatsDTO() {}

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalSellers() { return totalSellers; }
    public void setTotalSellers(long totalSellers) { this.totalSellers = totalSellers; }

    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

    public long getPendingProducts() { return pendingProducts; }
    public void setPendingProducts(long pendingProducts) { this.pendingProducts = pendingProducts; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public SustainabilityImpactDTO getImpact() { return impact; }
    public void setImpact(SustainabilityImpactDTO impact) { this.impact = impact; }
}
