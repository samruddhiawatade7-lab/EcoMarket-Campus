package com.ecomarket.dto;

import com.ecomarket.entity.HandoverMethod;
import com.ecomarket.entity.OrderStatus;
import com.ecomarket.entity.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OrderDTO {
    private Long id;
    private String orderNumber;
    private BigDecimal totalAmount;
    private BigDecimal subtotal;
    private BigDecimal deliveryFee;
    private String shippingAddress;
    private String city;
    private String state;
    private String pincode;
    private String phone;
    private PaymentStatus paymentStatus;
    private OrderStatus orderStatus;
    private String paymentMethod;
    private HandoverMethod handoverMethod;
    private String pickupLocation;
    private String preferredTimeSlot;
    private String handoverCode;
    private List<OrderItemDTO> items = new ArrayList<>();
    private List<OrderTrackingHistoryDTO> trackingHistory = new ArrayList<>();
    private Long buyerId;
    private String buyerName;
    private String buyerEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OrderDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(BigDecimal deliveryFee) { this.deliveryFee = deliveryFee; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public OrderStatus getOrderStatus() { return orderStatus; }
    public void setOrderStatus(OrderStatus orderStatus) { this.orderStatus = orderStatus; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public HandoverMethod getHandoverMethod() { return handoverMethod; }
    public void setHandoverMethod(HandoverMethod handoverMethod) { this.handoverMethod = handoverMethod; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getPreferredTimeSlot() { return preferredTimeSlot; }
    public void setPreferredTimeSlot(String preferredTimeSlot) { this.preferredTimeSlot = preferredTimeSlot; }

    public String getHandoverCode() { return handoverCode; }
    public void setHandoverCode(String handoverCode) { this.handoverCode = handoverCode; }

    public List<OrderItemDTO> getItems() { return items; }
    public void setItems(List<OrderItemDTO> items) { this.items = items; }

    public List<OrderTrackingHistoryDTO> getTrackingHistory() { return trackingHistory; }
    public void setTrackingHistory(List<OrderTrackingHistoryDTO> trackingHistory) { this.trackingHistory = trackingHistory; }

    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }

    public String getBuyerEmail() { return buyerEmail; }
    public void setBuyerEmail(String buyerEmail) { this.buyerEmail = buyerEmail; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
