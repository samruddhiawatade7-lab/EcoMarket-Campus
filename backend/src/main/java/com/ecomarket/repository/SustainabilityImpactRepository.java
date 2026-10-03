package com.ecomarket.repository;

import com.ecomarket.entity.SustainabilityImpact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SustainabilityImpactRepository extends JpaRepository<SustainabilityImpact, Long> {
    Optional<SustainabilityImpact> findByProductId(Long productId);
}
