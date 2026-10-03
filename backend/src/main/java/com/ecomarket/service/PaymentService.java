package com.ecomarket.service;

import com.ecomarket.dto.OrderDTO;
import com.ecomarket.dto.RazorpayOrderRequest;
import com.ecomarket.dto.RazorpayOrderResponse;
import com.ecomarket.dto.RazorpayVerificationRequest;
import com.ecomarket.entity.User;
import com.ecomarket.exception.BadRequestException;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Value("${razorpay.key_id:rzp_test_EcoMarketCampus2026}")
    private String keyId;

    @Value("${razorpay.key_secret:SecretEcoMarketCampusKey2026}")
    private String keySecret;

    @Value("${razorpay.currency:INR}")
    private String currency;

    @Autowired
    private AuthService authService;

    @Autowired
    private OrderService orderService;

    public RazorpayOrderResponse createRazorpayOrder(RazorpayOrderRequest request) {
        User currentUser = authService.getCurrentUser();
        BigDecimal amount = request.getAmount();

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Order amount must be greater than zero");
        }

        long amountInPaise = amount.multiply(new BigDecimal("100")).longValue();
        String razorpayOrderId;

        try {
            // Attempt to create actual order via Razorpay Java SDK
            RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", currency);
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());
            
            Order order = razorpay.orders.create(orderRequest);
            razorpayOrderId = order.get("id");
            logger.info("Successfully created Razorpay order: {}", razorpayOrderId);
        } catch (Exception e) {
            logger.warn("Razorpay API call failed or test mode active. Generating test order ID. Details: {}", e.getMessage());
            razorpayOrderId = "order_test_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);
        }

        return new RazorpayOrderResponse(
                razorpayOrderId,
                amountInPaise,
                currency,
                keyId,
                currentUser.getEmail(),
                currentUser.getName(),
                currentUser.getPhone() != null ? currentUser.getPhone() : "9876543210"
        );
    }

    public OrderDTO verifyPaymentAndCreateOrder(RazorpayVerificationRequest verificationRequest) {
        String orderId = verificationRequest.getRazorpayOrderId();
        String paymentId = verificationRequest.getRazorpayPaymentId();
        String signature = verificationRequest.getRazorpaySignature();

        // Verify Razorpay signature if it's a live Razorpay order
        if (orderId != null && !orderId.startsWith("order_test_")) {
            try {
                JSONObject options = new JSONObject();
                options.put("razorpay_order_id", orderId);
                options.put("razorpay_payment_id", paymentId);
                options.put("razorpay_signature", signature);

                boolean isValid = Utils.verifyPaymentSignature(options, keySecret);
                if (!isValid) {
                    throw new BadRequestException("Invalid payment signature verification failed");
                }
            } catch (Exception e) {
                logger.error("Payment verification failed: {}", e.getMessage());
                throw new BadRequestException("Payment verification failed: " + e.getMessage());
            }
        }

        // Set payment method details on checkout request
        if (verificationRequest.getCheckoutRequest().getPaymentMethod() == null) {
            verificationRequest.getCheckoutRequest().setPaymentMethod("RAZORPAY_GATEWAY");
        }

        // Complete purchase order via OrderService
        return orderService.createOrder(verificationRequest.getCheckoutRequest());
    }
}
