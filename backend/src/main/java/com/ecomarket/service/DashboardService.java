package com.ecomarket.service;

import com.ecomarket.dto.DashboardStatsDTO;
import com.ecomarket.dto.SustainabilityImpactDTO;
import com.ecomarket.entity.ProductStatus;
import com.ecomarket.entity.Role;
import com.ecomarket.entity.User;
import com.ecomarket.repository.OrderRepository;
import com.ecomarket.repository.ProductRepository;
import com.ecomarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private ImpactService impactService;

    public DashboardStatsDTO getAdminDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalSellers(userRepository.countByRole(Role.SELLER));
        stats.setTotalProducts(productRepository.count());
        stats.setPendingProducts(productRepository.countByStatus(ProductStatus.PENDING));
        stats.setTotalOrders(orderRepository.count());
        
        BigDecimal revenue = orderRepository.calculateTotalPlatformRevenue();
        stats.setTotalRevenue(revenue != null ? revenue : BigDecimal.ZERO);
        
        stats.setImpact(impactService.getGlobalImpact());
        return stats;
    }

    public DashboardStatsDTO getSellerDashboardStats() {
        User seller = authService.getCurrentUser();
        DashboardStatsDTO stats = new DashboardStatsDTO();

        stats.setTotalProducts(productRepository.countBySellerId(seller.getId()));
        
        long pending = productRepository.findBySellerIdAndStatus(seller.getId(), ProductStatus.PENDING, Pageable.unpaged()).getTotalElements();
        stats.setPendingProducts(pending);

        stats.setTotalOrders(orderRepository.countOrdersForSeller(seller.getId()));
        
        BigDecimal revenue = orderRepository.calculateSellerRevenue(seller.getId());
        stats.setTotalRevenue(revenue != null ? revenue : BigDecimal.ZERO);

        // Calculate seller specific impact
        Double co2 = orderRepository.calculateUserCo2Saved(seller.getId());
        Double water = orderRepository.calculateUserWaterSaved(seller.getId());
        Double waste = orderRepository.calculateUserWasteReduced(seller.getId());
        Long reused = orderRepository.calculateUserProductsReused(seller.getId());

        stats.setImpact(new SustainabilityImpactDTO(
                co2 != null ? co2 : 0.0,
                water != null ? water : 0.0,
                waste != null ? waste : 0.0,
                reused != null ? reused : 0L
        ));

        return stats;
    }
}
