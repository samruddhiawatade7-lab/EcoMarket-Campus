package com.ecomarket.dto;

import com.ecomarket.entity.ListingType;
import jakarta.validation.constraints.NotNull;

public class MarketplaceRequestCreateRequest {

    @NotNull
    private Long productId;

    @NotNull
    private ListingType requestType; // SELL (BUY), EXCHANGE, DONATE

    private String message;

    private Long offeredProductId; // for EXCHANGE

    private String pickupLocation;

    public MarketplaceRequestCreateRequest() {}

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public ListingType getRequestType() { return requestType; }
    public void setRequestType(ListingType requestType) { this.requestType = requestType; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Long getOfferedProductId() { return offeredProductId; }
    public void setOfferedProductId(Long offeredProductId) { this.offeredProductId = offeredProductId; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }
}
