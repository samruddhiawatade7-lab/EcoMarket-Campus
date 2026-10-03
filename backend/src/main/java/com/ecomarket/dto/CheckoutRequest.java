package com.ecomarket.dto;

import com.ecomarket.entity.HandoverMethod;
import jakarta.validation.constraints.NotBlank;

public class CheckoutRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Pincode is required")
    private String pincode;

    private String paymentMethod = "CARD";

    private HandoverMethod handoverMethod = HandoverMethod.CAMPUS_PICKUP;
    private String pickupLocation = "Campus Central Library";
    private String preferredTimeSlot = "10:00 AM - 05:00 PM";

    public CheckoutRequest() {}

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public HandoverMethod getHandoverMethod() { return handoverMethod; }
    public void setHandoverMethod(HandoverMethod handoverMethod) { this.handoverMethod = handoverMethod; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getPreferredTimeSlot() { return preferredTimeSlot; }
    public void setPreferredTimeSlot(String preferredTimeSlot) { this.preferredTimeSlot = preferredTimeSlot; }
}
