package com.ecomarket.dto;

public class SustainabilityImpactDTO {
    private Double co2Saved;
    private Double waterSaved;
    private Double wasteReduced;
    private Long productsReused;

    public SustainabilityImpactDTO() {}

    public SustainabilityImpactDTO(Double co2Saved, Double waterSaved, Double wasteReduced, Long productsReused) {
        this.co2Saved = co2Saved;
        this.waterSaved = waterSaved;
        this.wasteReduced = wasteReduced;
        this.productsReused = productsReused;
    }

    public Double getCo2Saved() { return co2Saved; }
    public void setCo2Saved(Double co2Saved) { this.co2Saved = co2Saved; }

    public Double getWaterSaved() { return waterSaved; }
    public void setWaterSaved(Double waterSaved) { this.waterSaved = waterSaved; }

    public Double getWasteReduced() { return wasteReduced; }
    public void setWasteReduced(Double wasteReduced) { this.wasteReduced = wasteReduced; }

    public Long getProductsReused() { return productsReused; }
    public void setProductsReused(Long productsReused) { this.productsReused = productsReused; }
}
