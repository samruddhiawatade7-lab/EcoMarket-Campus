package com.ecomarket.service;

import com.ecomarket.dto.ProductDTO;
import com.ecomarket.entity.Order;
import com.ecomarket.entity.OrderItem;
import com.ecomarket.entity.Product;
import com.ecomarket.entity.ProductStatus;
import com.ecomarket.mapper.DTOMapper;
import com.ecomarket.repository.OrderRepository;
import com.ecomarket.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Apriori Market Basket Analysis Recommendation Engine
 * Analyzes co-occurrence patterns in customer purchase orders to calculate
 * association rules (A => B) with Support and Confidence metrics.
 */
@Service
public class AprioriRecommendationService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private DTOMapper dtoMapper;

    public static class AssociationRule {
        private Long antecedentId; // Item A
        private Long consequentId; // Item B
        private double support;    // P(A & B)
        private double confidence; // P(B | A)
        private double lift;       // P(A & B) / (P(A) * P(B))

        public AssociationRule(Long antecedentId, Long consequentId, double support, double confidence, double lift) {
            this.antecedentId = antecedentId;
            this.consequentId = consequentId;
            this.support = support;
            this.confidence = confidence;
            this.lift = lift;
        }

        public Long getAntecedentId() { return antecedentId; }
        public Long getConsequentId() { return consequentId; }
        public double getSupport() { return support; }
        public double getConfidence() { return confidence; }
        public double getLift() { return lift; }
    }

    /**
     * Get Apriori-based related product recommendations for a list of target product IDs.
     */
    public List<ProductDTO> getAprioriRecommendations(List<Long> inputProductIds, int limit) {
        if (inputProductIds == null || inputProductIds.isEmpty()) {
            return getFallbackFeaturedProducts(limit, Collections.emptySet());
        }

        Set<Long> inputSet = new HashSet<>(inputProductIds);
        List<Order> allOrders = orderRepository.findAll();
        
        int totalTransactions = allOrders.size();
        if (totalTransactions == 0) {
            return getFallbackFeaturedProducts(limit, inputSet);
        }

        // 1. Build Itemset Frequencies
        Map<Long, Integer> itemFrequency = new HashMap<>();
        Map<String, Integer> pairFrequency = new HashMap<>();

        for (Order order : allOrders) {
            Set<Long> uniqueItemsInOrder = order.getOrderItems().stream()
                    .map(item -> item.getProduct().getId())
                    .collect(Collectors.toSet());

            for (Long item : uniqueItemsInOrder) {
                itemFrequency.put(item, itemFrequency.getOrDefault(item, 0) + 1);
            }

            List<Long> itemList = new ArrayList<>(uniqueItemsInOrder);
            for (int i = 0; i < itemList.size(); i++) {
                for (int j = i + 1; j < itemList.size(); j++) {
                    Long id1 = itemList.get(i);
                    Long id2 = itemList.get(j);
                    String pairKey1 = id1 + "_" + id2;
                    String pairKey2 = id2 + "_" + id1;
                    pairFrequency.put(pairKey1, pairFrequency.getOrDefault(pairKey1, 0) + 1);
                    pairFrequency.put(pairKey2, pairFrequency.getOrDefault(pairKey2, 0) + 1);
                }
            }
        }

        // 2. Generate Association Rules matching input items
        Map<Long, Double> recommendedScores = new HashMap<>();

        for (Long inputId : inputSet) {
            int countA = itemFrequency.getOrDefault(inputId, 0);
            if (countA == 0) continue;

            for (Map.Entry<String, Integer> entry : pairFrequency.entrySet()) {
                String[] parts = entry.getKey().split("_");
                Long ant = Long.parseLong(parts[0]);
                Long cons = Long.parseLong(parts[1]);

                if (ant.equals(inputId) && !inputSet.contains(cons)) {
                    int countAB = entry.getValue();
                    double support = (double) countAB / totalTransactions;
                    double confidence = (double) countAB / countA;
                    int countB = itemFrequency.getOrDefault(cons, 0);
                    double probB = (double) countB / totalTransactions;
                    double lift = probB > 0 ? (support / ((double) countA / totalTransactions * probB)) : 1.0;

                    // Apriori recommendation score combining confidence & support
                    double score = (confidence * 0.7) + (support * 0.3) + (lift * 0.1);
                    recommendedScores.put(cons, Math.max(recommendedScores.getOrDefault(cons, 0.0), score));
                }
            }
        }

        // 3. Collect & Order Recommended Products
        List<Long> rankedProductIds = recommendedScores.entrySet().stream()
                .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .limit(limit)
                .collect(Collectors.toList());

        List<Product> recommendedProducts = productRepository.findAllById(rankedProductIds);
        List<ProductDTO> dtos = recommendedProducts.stream()
                .filter(p -> p.getStatus() == ProductStatus.APPROVED && p.getQuantity() > 0)
                .map(dtoMapper::toProductDTO)
                .collect(Collectors.toList());

        // 4. Fill with category/eco fallback if Apriori matches are less than limit
        if (dtos.size() < limit) {
            Set<Long> existingIds = new HashSet<>(inputSet);
            dtos.forEach(d -> existingIds.add(d.getId()));

            List<ProductDTO> fallbacks = getCategoryAndEcoFallbacks(inputProductIds, limit - dtos.size(), existingIds);
            dtos.addAll(fallbacks);
        }

        return dtos;
    }

    /**
     * Get Frequently Bought Together recommendations for a single product.
     */
    public List<ProductDTO> getFrequentlyBoughtTogether(Long productId, int limit) {
        return getAprioriRecommendations(Collections.singletonList(productId), limit);
    }

    private List<ProductDTO> getCategoryAndEcoFallbacks(List<Long> inputProductIds, int limit, Set<Long> excludeIds) {
        if (inputProductIds.isEmpty()) {
            return getFallbackFeaturedProducts(limit, excludeIds);
        }

        Product baseProduct = productRepository.findById(inputProductIds.get(0)).orElse(null);
        if (baseProduct == null) {
            return getFallbackFeaturedProducts(limit, excludeIds);
        }

        List<Product> similar = productRepository.findSimilarProducts(
                baseProduct.getCategory().getId(),
                baseProduct.getId(),
                PageRequest.of(0, limit + excludeIds.size())
        );

        return similar.stream()
                .filter(p -> !excludeIds.contains(p.getId()))
                .limit(limit)
                .map(dtoMapper::toProductDTO)
                .collect(Collectors.toList());
    }

    private List<ProductDTO> getFallbackFeaturedProducts(int limit, Set<Long> excludeIds) {
        List<Product> top = productRepository.findTopFeaturedProducts(PageRequest.of(0, limit + excludeIds.size()));
        return top.stream()
                .filter(p -> !excludeIds.contains(p.getId()))
                .limit(limit)
                .map(dtoMapper::toProductDTO)
                .collect(Collectors.toList());
    }
}
