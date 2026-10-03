package com.ecomarket.service;

import com.ecomarket.dto.CheckoutRequest;
import com.ecomarket.dto.OrderDTO;
import com.ecomarket.entity.*;
import com.ecomarket.exception.BadRequestException;
import com.ecomarket.exception.ResourceNotFoundException;
import com.ecomarket.exception.UnauthorizedException;
import com.ecomarket.mapper.DTOMapper;
import com.ecomarket.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderTrackingHistoryRepository trackingHistoryRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private DTOMapper dtoMapper;

    @Transactional
    public OrderDTO createOrder(CheckoutRequest request) {
        User buyer = authService.getCurrentUser();
        Cart cart = cartRepository.findByUserId(buyer.getId())
                .orElseThrow(() -> new BadRequestException("Your cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Your cart is empty. Please add products before checking out.");
        }

        // Validate stock for all items
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();

            if (product.getStatus() != ProductStatus.APPROVED) {
                throw new BadRequestException("Product '" + product.getName() + "' is no longer available.");
            }

            if (product.getQuantity() < item.getQuantity()) {
                throw new BadRequestException("Insufficient stock for '" + product.getName() + "'. Available: " + product.getQuantity() + ", requested: " + item.getQuantity());
            }

            BigDecimal itemSubtotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(itemSubtotal);
        }

        // Delivery fee calculation based on Handover Method
        HandoverMethod method = request.getHandoverMethod() != null ? request.getHandoverMethod() : HandoverMethod.CAMPUS_PICKUP;
        BigDecimal deliveryFee = method == HandoverMethod.CAMPUS_DELIVERY ? new BigDecimal("49.00") : BigDecimal.ZERO;
        BigDecimal totalAmount = subtotal.add(deliveryFee);

        // Generate Order Number: ECO-YYYYMMDD-XXXX
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomStr = String.format("%04d", new Random().nextInt(10000));
        String orderNumber = "ECO-" + dateStr + "-" + randomStr;

        // Generate 6-digit One-Time Handover Code (OTP)
        String handoverCode = String.format("%06d", new Random().nextInt(1000000));

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setBuyer(buyer);
        order.setSubtotal(subtotal);
        order.setDeliveryFee(deliveryFee);
        order.setTotalAmount(totalAmount);
        order.setShippingAddress(request.getShippingAddress());
        order.setCity(request.getCity());
        order.setState(request.getState());
        order.setPincode(request.getPincode());
        order.setPhone(request.getPhone());
        order.setPaymentStatus(PaymentStatus.PAID); // Successful payment verification
        order.setOrderStatus(OrderStatus.PLACED);
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "RAZORPAY_GATEWAY");
        
        order.setHandoverMethod(method);
        order.setPickupLocation(request.getPickupLocation() != null ? request.getPickupLocation() : "Central Campus Library");
        order.setPreferredTimeSlot(request.getPreferredTimeSlot() != null ? request.getPreferredTimeSlot() : "10:00 AM - 05:00 PM");
        order.setHandoverCode(handoverCode);

        Order savedOrder = orderRepository.save(order);

        // Create OrderItems and reduce product stock
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            OrderItem orderItem = new OrderItem(
                    savedOrder,
                    product,
                    product.getSeller(),
                    cartItem.getQuantity(),
                    product.getPrice()
            );
            savedOrder.getOrderItems().add(orderItem);

            int newQuantity = product.getQuantity() - cartItem.getQuantity();
            product.setQuantity(newQuantity);
            if (newQuantity == 0) {
                product.setStatus(ProductStatus.SOLD_OUT);
            }
            productRepository.save(product);
        }

        // Add Initial Order Tracking History (PLACED)
        OrderTrackingHistory trackingPlaced = new OrderTrackingHistory(
                savedOrder,
                OrderStatus.PLACED,
                "Order Placed & Payment Verified",
                "Payment successfully verified via " + savedOrder.getPaymentMethod() + ". Waiting for seller confirmation.",
                savedOrder.getPickupLocation()
        );
        savedOrder.getTrackingHistory().add(trackingPlaced);

        Order finalOrder = orderRepository.save(savedOrder);

        // Clear user cart
        cart.getItems().clear();
        cartItemRepository.deleteByCartId(cart.getId());

        return dtoMapper.toOrderDTO(finalOrder);
    }

    public Page<OrderDTO> getUserOrders(Pageable pageable) {
        User buyer = authService.getCurrentUser();
        Page<Order> orders = orderRepository.findByBuyerIdOrderByCreatedAtDesc(buyer.getId(), pageable);
        return orders.map(dtoMapper::toOrderDTO);
    }

    public OrderDTO getOrderById(Long id) {
        User user = authService.getCurrentUser();
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        boolean isBuyer = order.getBuyer().getId().equals(user.getId());
        boolean isSeller = order.getOrderItems().stream().anyMatch(oi -> oi.getSeller().getId().equals(user.getId()));
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isBuyer && !isSeller && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to view this order");
        }

        return dtoMapper.toOrderDTO(order);
    }

    @Transactional
    public OrderDTO cancelOrder(Long id) {
        User buyer = authService.getCurrentUser();
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        if (!order.getBuyer().getId().equals(buyer.getId()) && buyer.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You are not authorized to cancel this order");
        }

        if (order.getOrderStatus() != OrderStatus.PLACED && order.getOrderStatus() != OrderStatus.CONFIRMED) {
            throw new BadRequestException("Order cannot be cancelled in its current state: " + order.getOrderStatus());
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        order.setPaymentStatus(PaymentStatus.REFUNDED);

        // Add Tracking Entry for Cancellation
        OrderTrackingHistory trackingCancelled = new OrderTrackingHistory(
                order,
                OrderStatus.CANCELLED,
                "Order Cancelled",
                "Order cancelled. Payment refund initiated.",
                order.getPickupLocation()
        );
        order.getTrackingHistory().add(trackingCancelled);

        // Restore inventory for cancelled items
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setQuantity(product.getQuantity() + item.getQuantity());
            if (product.getStatus() == ProductStatus.SOLD_OUT) {
                product.setStatus(ProductStatus.APPROVED);
            }
            productRepository.save(product);
        }

        Order updated = orderRepository.save(order);
        return dtoMapper.toOrderDTO(updated);
    }

    public Page<OrderDTO> getSellerOrders(Pageable pageable) {
        User seller = authService.getCurrentUser();
        Page<Order> orders = orderRepository.findOrdersForSeller(seller.getId(), pageable);
        return orders.map(dtoMapper::toOrderDTO);
    }

    public Page<OrderDTO> getAllOrdersAdmin(Pageable pageable) {
        Page<Order> orders = orderRepository.findAll(pageable);
        return orders.map(dtoMapper::toOrderDTO);
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long id, OrderStatus newStatus) {
        User user = authService.getCurrentUser();
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        boolean isSeller = order.getOrderItems().stream().anyMatch(oi -> oi.getSeller().getId().equals(user.getId()));
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isSeller && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to update this order's status");
        }

        // Block direct transition to DELIVERED without Handover Code verification
        if (newStatus == OrderStatus.DELIVERED) {
            throw new BadRequestException("Orders cannot be marked DELIVERED directly by seller alone. The buyer must provide or verify the 6-digit Handover Code to complete physical delivery.");
        }

        order.setOrderStatus(newStatus);

        // Create Tracking History Entry
        String title;
        String desc;
        if (newStatus == OrderStatus.CONFIRMED) {
            title = "Order Confirmed by Seller";
            desc = "Seller has accepted the order and is preparing the item for handover.";
        } else if (newStatus == OrderStatus.READY_FOR_HANDOVER) {
            title = "Ready for Campus Handover";
            desc = "Item is packaged and ready at " + order.getPickupLocation() + " (" + order.getPreferredTimeSlot() + "). Handover code sent to buyer.";
        } else {
            title = "Order Status Updated to " + newStatus;
            desc = "Status updated to " + newStatus;
        }

        OrderTrackingHistory trackingHistory = new OrderTrackingHistory(
                order,
                newStatus,
                title,
                desc,
                order.getPickupLocation()
        );
        order.getTrackingHistory().add(trackingHistory);

        Order updated = orderRepository.save(order);
        return dtoMapper.toOrderDTO(updated);
    }

    @Transactional
    public OrderDTO verifyHandoverCode(Long id, String inputCode) {
        User user = authService.getCurrentUser();
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        boolean isBuyer = order.getBuyer().getId().equals(user.getId());
        boolean isSeller = order.getOrderItems().stream().anyMatch(oi -> oi.getSeller().getId().equals(user.getId()));
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isBuyer && !isSeller && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to verify handover for this order");
        }

        if (order.getOrderStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException("Order is already marked as DELIVERED.");
        }

        if (inputCode == null || !inputCode.trim().equals(order.getHandoverCode())) {
            throw new BadRequestException("Invalid Handover Code. Physical handover verification failed.");
        }

        // Verification successful -> Transition to DELIVERED
        order.setOrderStatus(OrderStatus.DELIVERED);

        OrderTrackingHistory trackingDelivered = new OrderTrackingHistory(
                order,
                OrderStatus.DELIVERED,
                "Physical Handover Completed",
                "6-digit Handover Code verified successfully. Physical handover completed on campus.",
                order.getPickupLocation()
        );
        order.getTrackingHistory().add(trackingDelivered);

        Order updated = orderRepository.save(order);
        return dtoMapper.toOrderDTO(updated);
    }
}
