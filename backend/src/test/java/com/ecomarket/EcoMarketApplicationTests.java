package com.ecomarket;

import com.ecomarket.dto.*;
import com.ecomarket.entity.ProductCondition;
import com.ecomarket.service.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;

import java.util.List;

@SpringBootTest
public class EcoMarketApplicationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private SustainabilityService sustainabilityService;

    @Test
    void contextLoads() {
        Assertions.assertNotNull(authService);
        Assertions.assertNotNull(productService);
    }

    @Test
    void testSustainabilityScoringAlgorithm() {
        int score = sustainabilityService.calculateSustainabilityScore(ProductCondition.REFURBISHED, "Recycled Aluminum", "Electronics");
        Assertions.assertTrue(score >= 80, "Refurbished recycled product should have high sustainability score (>80)");
    }

    @Test
    void testProductFiltering() {
        Page<ProductDTO> products = productService.getProducts(
                null, "Electronics", null, null, null, null, null, null, null, null, null, null, "newest", 0, 10
        );
        Assertions.assertNotNull(products);
    }

    @Test
    void testCategoriesRetrieval() {
        List<CategoryDTO> categories = categoryService.getAllCategories();
        Assertions.assertFalse(categories.isEmpty(), "Categories list should not be empty");
    }
}
