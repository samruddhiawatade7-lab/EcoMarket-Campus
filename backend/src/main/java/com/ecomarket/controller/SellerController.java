package com.ecomarket.controller;

import com.ecomarket.dto.DashboardStatsDTO;
import com.ecomarket.dto.OrderDTO;
import com.ecomarket.dto.ProductDTO;
import com.ecomarket.entity.OrderStatus;
import com.ecomarket.service.DashboardService;
import com.ecomarket.service.OrderService;
import com.ecomarket.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seller")
@PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
public class SellerController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderService orderService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDTO> getSellerDashboard() {
        return ResponseEntity.ok(dashboardService.getSellerDashboardStats());
    }

    @GetMapping("/products")
    public ResponseEntity<Page<ProductDTO>> getSellerProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productService.getSellerProducts(pageable));
    }

    @GetMapping("/orders")
    public ResponseEntity<Page<OrderDTO>> getSellerOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(orderService.getSellerOrders(pageable));
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }
}
