package com.ecomarket.service;

import com.ecomarket.dto.ReviewCreateRequest;
import com.ecomarket.dto.ReviewDTO;
import com.ecomarket.entity.Product;
import com.ecomarket.entity.Review;
import com.ecomarket.entity.User;
import com.ecomarket.exception.BadRequestException;
import com.ecomarket.exception.ResourceNotFoundException;
import com.ecomarket.mapper.DTOMapper;
import com.ecomarket.repository.OrderItemRepository;
import com.ecomarket.repository.ProductRepository;
import com.ecomarket.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private DTOMapper dtoMapper;

    public List<ReviewDTO> getProductReviews(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(dtoMapper::toReviewDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewDTO createReview(Long productId, ReviewCreateRequest request) {
        User user = authService.getCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        // Rule: Buyer cannot review a product unless they purchased and received it
        Boolean hasDeliveredPurchase = orderItemRepository.existsDeliveredPurchase(user.getId(), productId);
        if (!Boolean.TRUE.equals(hasDeliveredPurchase)) {
            throw new BadRequestException("You can only review products that you have purchased and received.");
        }

        // Prevent duplicate review for the same product
        if (reviewRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            throw new BadRequestException("You have already reviewed this product.");
        }

        Review review = new Review(user, product, request.getRating(), request.getComment());
        Review saved = reviewRepository.save(review);

        return dtoMapper.toReviewDTO(saved);
    }
}
