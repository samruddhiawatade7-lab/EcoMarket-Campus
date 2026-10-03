package com.ecomarket.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class CartDTO {
    private Long id;
    private List<CartItemDTO> items = new ArrayList<>();
    private BigDecimal subtotal = BigDecimal.ZERO;
    private BigDecimal deliveryFee = BigDecimal.ZERO;
    private BigDecimal totalAmount = BigDecimal.ZERO;
    private Double co2Saved = 0.0;
    private Double waterSaved = 0.0;
    private Double wasteReduced = 0.0;

    public CartDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public List<CartItemDTO> getItems() { return items; }
    public void setItems(List<CartItemDTO> items) { this.items = items; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(BigDecimal deliveryFee) { this.deliveryFee = deliveryFee; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public Double getCo2Saved() { return co2Saved; }
    public void setCo2Saved(Double co2Saved) { this.co2Saved = co2Saved; }

    public Double getWaterSaved() { return waterSaved; }
    public void setWaterSaved(Double waterSaved) { this.waterSaved = waterSaved; }

    public Double getWasteReduced() { return wasteReduced; }
    public void setWasteReduced(Double wasteReduced) { this.wasteReduced = wasteReduced; }
}
