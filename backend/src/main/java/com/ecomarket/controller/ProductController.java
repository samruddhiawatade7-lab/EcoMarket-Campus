package com.ecomarket.controller;

import com.ecomarket.dto.ProductCreateRequest;
import com.ecomarket.dto.ProductDTO;
import com.ecomarket.entity.ListingType;
import com.ecomarket.entity.ProductCondition;
import com.ecomarket.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getProducts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) ProductCondition condition,
            @RequestParam(required = false) ListingType listingType,
            @RequestParam(required = false) Long collegeId,
            @RequestParam(required = false) Long campusId,
            @RequestParam(required = false) String semester,
            @RequestParam(required = false) String course,
            @RequestParam(required = false) Boolean isSemesterEndResale,
            @RequestParam(required = false) Boolean isClubListing,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false, defaultValue = "newest") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        Page<ProductDTO> products = productService.getProducts(
                query, category, condition, listingType, collegeId, campusId, semester, course,
                isSemesterEndResale, isClubListing, minPrice, maxPrice, sortBy, page, size
        );
        return ResponseEntity.ok(products);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<ProductDTO>> getFeaturedProducts() {
        return ResponseEntity.ok(productService.getFeaturedProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/{id}/similar")
    public ResponseEntity<List<ProductDTO>> getSimilarProducts(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getSimilarProducts(id));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductCreateRequest request) {
        ProductDTO created = productService.createProduct(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductCreateRequest request) {
        ProductDTO updated = productService.updateProduct(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Product listing removed successfully");
        return ResponseEntity.ok(response);
    }
}
