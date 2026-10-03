package com.ecomarket.service;

import com.ecomarket.dto.ProductDTO;
import com.ecomarket.entity.Product;
import com.ecomarket.entity.User;
import com.ecomarket.entity.Wishlist;
import com.ecomarket.exception.BadRequestException;
import com.ecomarket.exception.ResourceNotFoundException;
import com.ecomarket.mapper.DTOMapper;
import com.ecomarket.repository.ProductRepository;
import com.ecomarket.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private DTOMapper dtoMapper;

    public List<ProductDTO> getUserWishlist() {
        User user = authService.getCurrentUser();
        List<Wishlist> wishlists = wishlistRepository.findByUserId(user.getId());
        return wishlists.stream()
                .map(w -> dtoMapper.toProductDTO(w.getProduct()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void addToWishlist(Long productId) {
        User user = authService.getCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (wishlistRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            throw new BadRequestException("Product is already in your wishlist");
        }

        Wishlist wishlist = new Wishlist(user, product);
        wishlistRepository.save(wishlist);
    }

    @Transactional
    public void removeFromWishlist(Long productId) {
        User user = authService.getCurrentUser();
        wishlistRepository.deleteByUserIdAndProductId(user.getId(), productId);
    }

    public boolean isInWishlist(Long productId) {
        User user = authService.getCurrentUser();
        return wishlistRepository.existsByUserIdAndProductId(user.getId(), productId);
    }
}
