package com.ecomarket.service;

import com.ecomarket.entity.ProductCondition;
import com.ecomarket.entity.SustainabilityImpact;
import com.ecomarket.repository.SustainabilityImpactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SustainabilityService {

    @Autowired
    private SustainabilityImpactRepository sustainabilityImpactRepository;

    public int calculateSustainabilityScore(ProductCondition condition, String material, String categoryName) {
        int score = 50; // Base score

        if (condition != null) {
            switch (condition) {
                case REFURBISHED -> score += 25;
                case UPCYCLED -> score += 25;
                case LIKE_NEW -> score += 20;
                case GOOD -> score += 15;
                case FAIR -> score += 10;
                case NEW -> score += 5;
            }
        }

        if (material != null) {
            String matLower = material.toLowerCase();
            if (matLower.contains("recycled") || matLower.contains("bamboo") || matLower.contains("organic") ||
                matLower.contains("cotton") || matLower.contains("wood") || matLower.contains("hemp") || matLower.contains("glass")) {
                score += 15;
            } else if (matLower.contains("metal") || matLower.contains("aluminum")) {
                score += 10;
            }
        }

        if (categoryName != null) {
            String catLower = categoryName.toLowerCase();
            if (catLower.contains("eco") || catLower.contains("upcycled") || catLower.contains("refurbished")) {
                score += 10;
            }
        }

        return Math.min(100, Math.max(10, score));
    }

    public double estimateCo2Saved(ProductCondition condition, String categoryName) {
        double baseCo2 = 2.0; // kg
        if (condition != null) {
            switch (condition) {
                case REFURBISHED -> baseCo2 = 18.5;
                case UPCYCLED -> baseCo2 = 14.0;
                case LIKE_NEW -> baseCo2 = 11.2;
                case GOOD -> baseCo2 = 8.5;
                case FAIR -> baseCo2 = 5.4;
                case NEW -> baseCo2 = 1.5;
            }
        }

        if (categoryName != null) {
            String catLower = categoryName.toLowerCase();
            if (catLower.contains("electronics")) baseCo2 *= 1.8;
            else if (catLower.contains("furniture")) baseCo2 *= 1.5;
            else if (catLower.contains("fashion")) baseCo2 *= 1.2;
        }

        return Math.round(baseCo2 * 10.0) / 10.0;
    }

    public double estimateWaterSaved(ProductCondition condition, String categoryName) {
        double baseWater = 400.0; // Liters
        if (categoryName != null) {
            String catLower = categoryName.toLowerCase();
            if (catLower.contains("fashion") || catLower.contains("accessories")) baseWater = 2700.0;
            else if (catLower.contains("electronics")) baseWater = 1900.0;
            else if (catLower.contains("furniture")) baseWater = 1200.0;
            else if (catLower.contains("home")) baseWater = 800.0;
            else if (catLower.contains("books")) baseWater = 350.0;
        }

        if (condition != null && condition == ProductCondition.NEW) {
            baseWater *= 0.2;
        }

        return Math.round(baseWater * 10.0) / 10.0;
    }

    public double estimateWasteReduced(ProductCondition condition, String categoryName) {
        double baseWaste = 1.0; // kg
        if (condition != null) {
            switch (condition) {
                case REFURBISHED -> baseWaste = 4.2;
                case UPCYCLED -> baseWaste = 3.5;
                case LIKE_NEW -> baseWaste = 2.8;
                case GOOD -> baseWaste = 2.1;
                case FAIR -> baseWaste = 1.5;
                case NEW -> baseWaste = 0.4;
            }
        }
        return Math.round(baseWaste * 10.0) / 10.0;
    }
}
