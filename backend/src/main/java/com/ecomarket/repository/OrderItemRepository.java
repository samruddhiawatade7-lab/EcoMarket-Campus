package com.ecomarket.repository;

import com.ecomarket.entity.OrderItem;
import com.ecomarket.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);
    List<OrderItem> findBySellerId(Long sellerId);
    
    @Query("SELECT COUNT(oi) > 0 FROM OrderItem oi WHERE oi.order.buyer.id = :buyerId AND oi.product.id = :productId AND oi.order.orderStatus = 'DELIVERED'")
    Boolean existsDeliveredPurchase(@Param("buyerId") Long buyerId, @Param("productId") Long productId);
}
