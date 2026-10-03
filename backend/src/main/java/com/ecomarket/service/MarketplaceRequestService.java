package com.ecomarket.service;

import com.ecomarket.dto.MarketplaceRequestCreateRequest;
import com.ecomarket.dto.MarketplaceRequestDTO;
import com.ecomarket.entity.*;
import com.ecomarket.exception.BadRequestException;
import com.ecomarket.exception.ResourceNotFoundException;
import com.ecomarket.exception.UnauthorizedException;
import com.ecomarket.mapper.DTOMapper;
import com.ecomarket.repository.MarketplaceRequestRepository;
import com.ecomarket.repository.ProductRepository;
import com.ecomarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MarketplaceRequestService {

    @Autowired
    private MarketplaceRequestRepository requestRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DTOMapper dtoMapper;

    @Transactional
    public MarketplaceRequestDTO createRequest(Long buyerId, MarketplaceRequestCreateRequest req) {
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + buyerId));

        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + req.getProductId()));

        if (product.getSeller().getId().equals(buyerId)) {
            throw new BadRequestException("You cannot request your own product listing");
        }

        MarketplaceRequest request = new MarketplaceRequest(
                product,
                buyer,
                product.getSeller(),
                req.getRequestType(),
                req.getMessage(),
                req.getPickupLocation() != null ? req.getPickupLocation() : "Campus Main Gate / Library Fountain"
        );

        if (req.getRequestType() == ListingType.EXCHANGE && req.getOfferedProductId() != null) {
            Product offered = productRepository.findById(req.getOfferedProductId()).orElse(null);
            request.setOfferedProduct(offered);
        }

        MarketplaceRequest saved = requestRepository.save(request);
        return dtoMapper.toMarketplaceRequestDTO(saved);
    }

    public List<MarketplaceRequestDTO> getUserRequests(Long buyerId) {
        return requestRepository.findByBuyerIdOrderByCreatedAtDesc(buyerId).stream()
                .map(dtoMapper::toMarketplaceRequestDTO)
                .collect(Collectors.toList());
    }

    public List<MarketplaceRequestDTO> getSellerRequests(Long sellerId) {
        return requestRepository.findBySellerIdOrderByCreatedAtDesc(sellerId).stream()
                .map(dtoMapper::toMarketplaceRequestDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public MarketplaceRequestDTO updateRequestStatus(Long requestId, Long userId, MarketplaceRequestStatus status, String pickupLocation) {
        MarketplaceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + requestId));

        if (!request.getSeller().getId().equals(userId) && !request.getBuyer().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to update this request");
        }

        request.setStatus(status);
        if (pickupLocation != null && !pickupLocation.isBlank()) {
            request.setPickupLocation(pickupLocation);
        }

        if (status == MarketplaceRequestStatus.COMPLETED) {
            Product product = request.getProduct();
            product.setQuantity(Math.max(0, product.getQuantity() - 1));
            if (product.getQuantity() == 0) {
                product.setStatus(ProductStatus.SOLD_OUT);
            }
            productRepository.save(product);
        }

        MarketplaceRequest updated = requestRepository.save(request);
        return dtoMapper.toMarketplaceRequestDTO(updated);
    }
}
