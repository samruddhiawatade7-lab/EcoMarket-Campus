package com.ecomarket.controller;

import com.ecomarket.dto.MarketplaceRequestCreateRequest;
import com.ecomarket.dto.MarketplaceRequestDTO;
import com.ecomarket.entity.MarketplaceRequestStatus;
import com.ecomarket.entity.User;
import com.ecomarket.service.AuthService;
import com.ecomarket.service.MarketplaceRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
public class MarketplaceRequestController {

    @Autowired
    private MarketplaceRequestService requestService;

    @Autowired
    private AuthService authService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MarketplaceRequestDTO> createRequest(@Valid @RequestBody MarketplaceRequestCreateRequest request) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(requestService.createRequest(user.getId(), request));
    }

    @GetMapping("/my-requests")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MarketplaceRequestDTO>> getUserRequests() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(requestService.getUserRequests(user.getId()));
    }

    @GetMapping("/seller-requests")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MarketplaceRequestDTO>> getSellerRequests() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(requestService.getSellerRequests(user.getId()));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MarketplaceRequestDTO> updateRequestStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        User user = authService.getCurrentUser();
        MarketplaceRequestStatus status = MarketplaceRequestStatus.valueOf(body.get("status"));
        String pickupLocation = body.get("pickupLocation");
        return ResponseEntity.ok(requestService.updateRequestStatus(id, user.getId(), status, pickupLocation));
    }
}
