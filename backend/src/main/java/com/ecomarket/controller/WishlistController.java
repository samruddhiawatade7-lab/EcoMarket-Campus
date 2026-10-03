package com.ecomarket.controller;

import com.ecomarket.dto.ProductDTO;
import com.ecomarket.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getWishlist() {
        return ResponseEntity.ok(wishlistService.getUserWishlist());
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Map<String, String>> addToWishlist(@PathVariable Long productId) {
        wishlistService.addToWishlist(productId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Product added to wishlist");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Map<String, String>> removeFromWishlist(@PathVariable Long productId) {
        wishlistService.removeFromWishlist(productId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Product removed from wishlist");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Boolean>> checkWishlist(@PathVariable Long productId) {
        boolean inWishlist = wishlistService.isInWishlist(productId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("inWishlist", inWishlist);
        return ResponseEntity.ok(response);
    }
}
