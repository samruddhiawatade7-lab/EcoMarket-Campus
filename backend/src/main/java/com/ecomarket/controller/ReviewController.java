package com.ecomarket.controller;

import com.ecomarket.dto.ReviewCreateRequest;
import com.ecomarket.dto.ReviewDTO;
import com.ecomarket.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<ReviewDTO>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }

    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(
            @PathVariable Long productId,
            @Valid @RequestBody ReviewCreateRequest request
    ) {
        ReviewDTO created = reviewService.createReview(productId, request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
