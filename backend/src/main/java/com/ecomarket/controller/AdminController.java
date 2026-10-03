package com.ecomarket.controller;

import com.ecomarket.dto.DashboardStatsDTO;
import com.ecomarket.dto.OrderDTO;
import com.ecomarket.dto.ProductDTO;
import com.ecomarket.dto.UserDTO;
import com.ecomarket.entity.OrderStatus;
import com.ecomarket.entity.Role;
import com.ecomarket.service.DashboardService;
import com.ecomarket.service.OrderService;
import com.ecomarket.service.ProductService;
import com.ecomarket.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderService orderService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDTO> getAdminDashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<Page<UserDTO>> getUsers(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Role role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(userService.getUsers(query, role, pageable));
    }

    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<UserDTO> toggleUserStatus(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toggleUserStatus(id));
    }

    @GetMapping("/products/pending")
    public ResponseEntity<Page<ProductDTO>> getPendingProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productService.getPendingProducts(pageable));
    }

    @PutMapping("/products/{id}/approve")
    public ResponseEntity<ProductDTO> approveProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.approveProduct(id));
    }

    @PutMapping("/products/{id}/reject")
    public ResponseEntity<ProductDTO> rejectProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.rejectProduct(id));
    }

    @GetMapping("/orders")
    public ResponseEntity<Page<OrderDTO>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(orderService.getAllOrdersAdmin(pageable));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}
