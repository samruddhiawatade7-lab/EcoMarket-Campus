package com.ecomarket.dto;

import com.ecomarket.entity.ListingType;
import com.ecomarket.entity.MarketplaceRequestStatus;

import java.time.LocalDateTime;

public class MarketplaceRequestDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private String productPrice;
    private Long buyerId;
    private String buyerName;
    private String buyerEmail;
    private String buyerCollege;
    private Long sellerId;
    private String sellerName;
    private String sellerEmail;
    private String sellerCollege;
    private ListingType requestType;
    private MarketplaceRequestStatus status;
    private String message;
    private Long offeredProductId;
    private String offeredProductName;
    private String pickupLocation;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MarketplaceRequestDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductImage() { return productImage; }
    public void setProductImage(String productImage) { this.productImage = productImage; }

    public String getProductPrice() { return productPrice; }
    public void setProductPrice(String productPrice) { this.productPrice = productPrice; }

    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }

    public String getBuyerEmail() { return buyerEmail; }
    public void setBuyerEmail(String buyerEmail) { this.buyerEmail = buyerEmail; }

    public String getBuyerCollege() { return buyerCollege; }
    public void setBuyerCollege(String buyerCollege) { this.buyerCollege = buyerCollege; }

    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }

    public String getSellerEmail() { return sellerEmail; }
    public void setSellerEmail(String sellerEmail) { this.sellerEmail = sellerEmail; }

    public String getSellerCollege() { return sellerCollege; }
    public void setSellerCollege(String sellerCollege) { this.sellerCollege = sellerCollege; }

    public ListingType getRequestType() { return requestType; }
    public void setRequestType(ListingType requestType) { this.requestType = requestType; }

    public MarketplaceRequestStatus getStatus() { return status; }
    public void setStatus(MarketplaceRequestStatus status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Long getOfferedProductId() { return offeredProductId; }
    public void setOfferedProductId(Long offeredProductId) { this.offeredProductId = offeredProductId; }

    public String getOfferedProductName() { return offeredProductName; }
    public void setOfferedProductName(String offeredProductName) { this.offeredProductName = offeredProductName; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
