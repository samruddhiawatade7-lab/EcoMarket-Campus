package com.ecomarket.repository;

import com.ecomarket.entity.MarketplaceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarketplaceRequestRepository extends JpaRepository<MarketplaceRequest, Long> {
    List<MarketplaceRequest> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);
    List<MarketplaceRequest> findBySellerIdOrderByCreatedAtDesc(Long sellerId);
    List<MarketplaceRequest> findByProductId(Long productId);
}
