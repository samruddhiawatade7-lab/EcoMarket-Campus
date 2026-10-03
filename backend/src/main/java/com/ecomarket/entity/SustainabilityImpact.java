package com.ecomarket.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sustainability_impacts")
public class SustainabilityImpact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    private Double co2Saved;
    private Double waterSaved;
    private Double wasteReduced;

    private String calculationMethod;

    @Column(nullable = false, updatable = false, columnDefinition = "DATETIME")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public SustainabilityImpact() {}

    public SustainabilityImpact(Product product, Double co2Saved, Double waterSaved, Double wasteReduced, String calculationMethod) {
        this.product = product;
        this.co2Saved = co2Saved;
        this.waterSaved = waterSaved;
        this.wasteReduced = wasteReduced;
        this.calculationMethod = calculationMethod;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Double getCo2Saved() { return co2Saved; }
    public void setCo2Saved(Double co2Saved) { this.co2Saved = co2Saved; }

    public Double getWaterSaved() { return waterSaved; }
    public void setWaterSaved(Double waterSaved) { this.waterSaved = waterSaved; }

    public Double getWasteReduced() { return wasteReduced; }
    public void setWasteReduced(Double wasteReduced) { this.wasteReduced = wasteReduced; }

    public String getCalculationMethod() { return calculationMethod; }
    public void setCalculationMethod(String calculationMethod) { this.calculationMethod = calculationMethod; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
