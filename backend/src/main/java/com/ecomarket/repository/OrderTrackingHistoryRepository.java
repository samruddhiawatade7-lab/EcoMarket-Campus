package com.ecomarket.repository;

import com.ecomarket.entity.OrderTrackingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderTrackingHistoryRepository extends JpaRepository<OrderTrackingHistory, Long> {
    List<OrderTrackingHistory> findByOrderIdOrderByTimestampAsc(Long orderId);
}
