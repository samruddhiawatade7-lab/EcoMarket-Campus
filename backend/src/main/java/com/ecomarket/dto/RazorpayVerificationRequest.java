package com.ecomarket.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RazorpayVerificationRequest {

    @NotBlank(message = "Razorpay order ID is required")
    private String razorpayOrderId;

    @NotBlank(message = "Razorpay payment ID is required")
    private String razorpayPaymentId;

    @NotBlank(message = "Razorpay signature is required")
    private String razorpaySignature;

    @NotNull(message = "Checkout details are required")
    @Valid
    private CheckoutRequest checkoutRequest;

    public RazorpayVerificationRequest() {
    }

    public RazorpayVerificationRequest(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature, CheckoutRequest checkoutRequest) {
        this.razorpayOrderId = razorpayOrderId;
        this.razorpayPaymentId = razorpayPaymentId;
        this.razorpaySignature = razorpaySignature;
        this.checkoutRequest = checkoutRequest;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public String getRazorpaySignature() {
        return razorpaySignature;
    }

    public void setRazorpaySignature(String razorpaySignature) {
        this.razorpaySignature = razorpaySignature;
    }

    public CheckoutRequest getCheckoutRequest() {
        return checkoutRequest;
    }

    public void setCheckoutRequest(CheckoutRequest checkoutRequest) {
        this.checkoutRequest = checkoutRequest;
    }
}
