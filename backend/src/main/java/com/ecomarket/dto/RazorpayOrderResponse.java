package com.ecomarket.dto;

public class RazorpayOrderResponse {
    private String razorpayOrderId;
    private long amountInPaise;
    private String currency;
    private String keyId;
    private String userEmail;
    private String userName;
    private String userPhone;

    public RazorpayOrderResponse() {
    }

    public RazorpayOrderResponse(String razorpayOrderId, long amountInPaise, String currency, String keyId, String userEmail, String userName, String userPhone) {
        this.razorpayOrderId = razorpayOrderId;
        this.amountInPaise = amountInPaise;
        this.currency = currency;
        this.keyId = keyId;
        this.userEmail = userEmail;
        this.userName = userName;
        this.userPhone = userPhone;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public long getAmountInPaise() {
        return amountInPaise;
    }

    public void setAmountInPaise(long amountInPaise) {
        this.amountInPaise = amountInPaise;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getKeyId() {
        return keyId;
    }

    public void setKeyId(String keyId) {
        this.keyId = keyId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserPhone() {
        return userPhone;
    }

    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }
}
