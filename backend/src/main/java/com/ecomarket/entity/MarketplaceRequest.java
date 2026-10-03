package com.ecomarket.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "marketplace_requests")
public class MarketplaceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ListingType requestType; // SELL (BUY), EXCHANGE, DONATE

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MarketplaceRequestStatus status = MarketplaceRequestStatus.REQUESTED;

    @Column(columnDefinition = "TEXT")
    private String message;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "offered_product_id")
    private Product offeredProduct; // for EXCHANGE requests

    private String pickupLocation; // e.g. "Library Fountain", "Hostel 4 Gate", "Student Center"

    @Column(nullable = false, updatable = false, columnDefinition = "DATETIME")
    private LocalDateTime createdAt;

    @Column(columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public MarketplaceRequest() {}

    public MarketplaceRequest(Product product, User buyer, User seller, ListingType requestType, String message, String pickupLocation) {
        this.product = product;
        this.buyer = buyer;
        this.seller = seller;
        this.requestType = requestType;
        this.message = message;
        this.pickupLocation = pickupLocation;
        this.status = MarketplaceRequestStatus.REQUESTED;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public User getBuyer() { return buyer; }
    public void setBuyer(User buyer) { this.buyer = buyer; }

    public User getSeller() { return seller; }
    public void setSeller(User seller) { this.seller = seller; }

    public ListingType getRequestType() { return requestType; }
    public void setRequestType(ListingType requestType) { this.requestType = requestType; }

    public MarketplaceRequestStatus getStatus() { return status; }
    public void setStatus(MarketplaceRequestStatus status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Product getOfferedProduct() { return offeredProduct; }
    public void setOfferedProduct(Product offeredProduct) { this.offeredProduct = offeredProduct; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
