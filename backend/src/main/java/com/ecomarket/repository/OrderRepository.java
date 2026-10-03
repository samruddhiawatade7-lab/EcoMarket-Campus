package com.ecomarket.repository;

import com.ecomarket.entity.Order;
import com.ecomarket.entity.OrderStatus;
import com.ecomarket.entity.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    Optional<Order> findByOrderNumber(String orderNumber);
    
    Page<Order> findByBuyerIdOrderByCreatedAtDesc(Long buyerId, Pageable pageable);
    
    List<Order> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);
    
    @Query("SELECT DISTINCT o FROM Order o JOIN o.orderItems oi WHERE oi.seller.id = :sellerId ORDER BY o.createdAt DESC")
    Page<Order> findOrdersForSeller(@Param("sellerId") Long sellerId, Pageable pageable);
    
    @Query("SELECT DISTINCT o FROM Order o JOIN o.orderItems oi WHERE oi.seller.id = :sellerId ORDER BY o.createdAt DESC")
    List<Order> findOrdersForSellerList(@Param("sellerId") Long sellerId);

    long countByBuyerId(Long buyerId);
    
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.paymentStatus = 'PAID'")
    BigDecimal calculateTotalPlatformRevenue();

    @Query("SELECT COALESCE(SUM(oi.price * oi.quantity), 0) FROM OrderItem oi JOIN oi.order o WHERE oi.seller.id = :sellerId AND o.paymentStatus = 'PAID'")
    BigDecimal calculateSellerRevenue(@Param("sellerId") Long sellerId);

    @Query("SELECT COUNT(DISTINCT o) FROM Order o JOIN o.orderItems oi WHERE oi.seller.id = :sellerId")
    long countOrdersForSeller(@Param("sellerId") Long sellerId);
    
    @Query("SELECT COALESCE(SUM(p.co2Saved * oi.quantity), 0) FROM Order o JOIN o.orderItems oi JOIN oi.product p WHERE o.buyer.id = :buyerId AND o.orderStatus = 'DELIVERED'")
    Double calculateUserCo2Saved(@Param("buyerId") Long buyerId);

    @Query("SELECT COALESCE(SUM(p.waterSaved * oi.quantity), 0) FROM Order o JOIN o.orderItems oi JOIN oi.product p WHERE o.buyer.id = :buyerId AND o.orderStatus = 'DELIVERED'")
    Double calculateUserWaterSaved(@Param("buyerId") Long buyerId);

    @Query("SELECT COALESCE(SUM(p.wasteReduced * oi.quantity), 0) FROM Order o JOIN o.orderItems oi JOIN oi.product p WHERE o.buyer.id = :buyerId AND o.orderStatus = 'DELIVERED'")
    Double calculateUserWasteReduced(@Param("buyerId") Long buyerId);

    @Query("SELECT COALESCE(SUM(oi.quantity), 0) FROM Order o JOIN o.orderItems oi WHERE o.buyer.id = :buyerId AND o.orderStatus = 'DELIVERED'")
    Long calculateUserProductsReused(@Param("buyerId") Long buyerId);
    
    @Query("SELECT COALESCE(SUM(p.co2Saved * oi.quantity), 0) FROM Order o JOIN o.orderItems oi JOIN oi.product p WHERE o.orderStatus = 'DELIVERED'")
    Double calculateGlobalCo2Saved();

    @Query("SELECT COALESCE(SUM(p.waterSaved * oi.quantity), 0) FROM Order o JOIN o.orderItems oi JOIN oi.product p WHERE o.orderStatus = 'DELIVERED'")
    Double calculateGlobalWaterSaved();

    @Query("SELECT COALESCE(SUM(p.wasteReduced * oi.quantity), 0) FROM Order o JOIN o.orderItems oi JOIN oi.product p WHERE o.orderStatus = 'DELIVERED'")
    Double calculateGlobalWasteReduced();

    @Query("SELECT COALESCE(SUM(oi.quantity), 0) FROM Order o JOIN o.orderItems oi WHERE o.orderStatus = 'DELIVERED'")
    Long calculateGlobalProductsReused();
}
