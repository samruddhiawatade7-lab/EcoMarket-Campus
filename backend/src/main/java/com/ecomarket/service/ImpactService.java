package com.ecomarket.service;

import com.ecomarket.dto.SustainabilityImpactDTO;
import com.ecomarket.entity.User;
import com.ecomarket.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ImpactService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private AuthService authService;

    public SustainabilityImpactDTO getGlobalImpact() {
        Double co2 = orderRepository.calculateGlobalCo2Saved();
        Double water = orderRepository.calculateGlobalWaterSaved();
        Double waste = orderRepository.calculateGlobalWasteReduced();
        Long reused = orderRepository.calculateGlobalProductsReused();

        return new SustainabilityImpactDTO(
                co2 != null ? Math.round(co2 * 100.0) / 100.0 : 0.0,
                water != null ? Math.round(water * 100.0) / 100.0 : 0.0,
                waste != null ? Math.round(waste * 100.0) / 100.0 : 0.0,
                reused != null ? reused : 0L
        );
    }

    public SustainabilityImpactDTO getUserImpact() {
        User user = authService.getCurrentUser();
        Double co2 = orderRepository.calculateUserCo2Saved(user.getId());
        Double water = orderRepository.calculateUserWaterSaved(user.getId());
        Double waste = orderRepository.calculateUserWasteReduced(user.getId());
        Long reused = orderRepository.calculateUserProductsReused(user.getId());

        return new SustainabilityImpactDTO(
                co2 != null ? Math.round(co2 * 100.0) / 100.0 : 0.0,
                water != null ? Math.round(water * 100.0) / 100.0 : 0.0,
                waste != null ? Math.round(waste * 100.0) / 100.0 : 0.0,
                reused != null ? reused : 0L
        );
    }
}
