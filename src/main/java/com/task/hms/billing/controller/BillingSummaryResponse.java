package com.task.hms.billing.controller;

public class BillingSummaryResponse {
    private double totalRevenue;
    private double totalPaid;
    private double totalUnpaid;
    private int billCount;

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }
    public double getTotalPaid() { return totalPaid; }
    public void setTotalPaid(double totalPaid) { this.totalPaid = totalPaid; }
    public double getTotalUnpaid() { return totalUnpaid; }
    public void setTotalUnpaid(double totalUnpaid) { this.totalUnpaid = totalUnpaid; }
    public int getBillCount() { return billCount; }
    public void setBillCount(int billCount) { this.billCount = billCount; }
}
