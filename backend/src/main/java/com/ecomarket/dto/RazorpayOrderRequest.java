package com.ecomarket.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class RazorpayOrderRequest {

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    private String currency = "INR";

    public RazorpayOrderRequest() {
    }

    public RazorpayOrderRequest(BigDecimal amount, String currency) {
        this.amount = amount;
        this.currency = currency;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
