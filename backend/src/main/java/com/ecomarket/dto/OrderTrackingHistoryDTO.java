package com.ecomarket.dto;

import com.ecomarket.entity.OrderStatus;
import java.time.LocalDateTime;

public class OrderTrackingHistoryDTO {
    private Long id;
    private OrderStatus status;
    private String title;
    private String description;
    private String location;
    private LocalDateTime timestamp;

    public OrderTrackingHistoryDTO() {}

    public OrderTrackingHistoryDTO(Long id, OrderStatus status, String title, String description, String location, LocalDateTime timestamp) {
        this.id = id;
        this.status = status;
        this.title = title;
        this.description = description;
        this.location = location;
        this.timestamp = timestamp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
