package com.ecomarket.controller;

import com.ecomarket.dto.OrderDTO;
import com.ecomarket.dto.RazorpayOrderRequest;
import com.ecomarket.dto.RazorpayOrderResponse;
import com.ecomarket.dto.RazorpayVerificationRequest;
import com.ecomarket.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-razorpay-order")
    public ResponseEntity<RazorpayOrderResponse> createRazorpayOrder(@Valid @RequestBody RazorpayOrderRequest request) {
        RazorpayOrderResponse response = paymentService.createRazorpayOrder(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/verify-razorpay-payment")
    public ResponseEntity<OrderDTO> verifyRazorpayPayment(@Valid @RequestBody RazorpayVerificationRequest request) {
        OrderDTO order = paymentService.verifyPaymentAndCreateOrder(request);
        return ResponseEntity.ok(order);
    }
}
