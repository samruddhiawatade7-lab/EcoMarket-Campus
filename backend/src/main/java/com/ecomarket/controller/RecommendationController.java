package com.ecomarket.controller;

import com.ecomarket.dto.ProductDTO;
import com.ecomarket.service.AprioriRecommendationService;
import com.ecomarket.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    @Autowired
    private ProductService productService;

    @Autowired
    private AprioriRecommendationService aprioriRecommendationService;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getRecommendations() {
        return ResponseEntity.ok(productService.getFeaturedProducts());
    }

    @GetMapping("/apriori")
    public ResponseEntity<List<ProductDTO>> getAprioriRecommendations(
            @RequestParam(required = false) String productIds,
            @RequestParam(defaultValue = "4") int limit
    ) {
        List<Long> ids = Collections.emptyList();
        if (productIds != null && !productIds.trim().isEmpty()) {
            try {
                ids = Arrays.stream(productIds.split(","))
                        .map(String::trim)
                        .map(Long::parseLong)
                        .collect(Collectors.toList());
            } catch (Exception ignored) {}
        }
        return ResponseEntity.ok(aprioriRecommendationService.getAprioriRecommendations(ids, limit));
    }

    @GetMapping("/frequently-bought-together/{productId}")
    public ResponseEntity<List<ProductDTO>> getFrequentlyBoughtTogether(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "3") int limit
    ) {
        return ResponseEntity.ok(aprioriRecommendationService.getFrequentlyBoughtTogether(productId, limit));
    }
}
