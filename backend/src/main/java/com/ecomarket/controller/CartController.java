package com.ecomarket.controller;

import com.ecomarket.dto.AddToCartRequest;
import com.ecomarket.dto.CartDTO;
import com.ecomarket.dto.UpdateCartQuantityRequest;
import com.ecomarket.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<CartDTO> getCart() {
        return ResponseEntity.ok(cartService.getCart());
    }

    @PostMapping("/items")
    public ResponseEntity<CartDTO> addToCart(@Valid @RequestBody AddToCartRequest request) {
        CartDTO updatedCart = cartService.addToCart(request);
        return ResponseEntity.ok(updatedCart);
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartDTO> updateQuantity(@PathVariable Long itemId, @Valid @RequestBody UpdateCartQuantityRequest request) {
        CartDTO updatedCart = cartService.updateQuantity(itemId, request);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartDTO> removeItem(@PathVariable Long itemId) {
        CartDTO updatedCart = cartService.removeItem(itemId);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping
    public ResponseEntity<Map<String, String>> clearCart() {
        cartService.clearCart();
        Map<String, String> response = new HashMap<>();
        response.put("message", "Cart cleared successfully");
        return ResponseEntity.ok(response);
    }
}
