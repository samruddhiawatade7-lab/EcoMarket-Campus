package com.ecomarket.service;

import com.ecomarket.dto.AddToCartRequest;
import com.ecomarket.dto.CartDTO;
import com.ecomarket.dto.UpdateCartQuantityRequest;
import com.ecomarket.entity.Cart;
import com.ecomarket.entity.CartItem;
import com.ecomarket.entity.Product;
import com.ecomarket.entity.ProductStatus;
import com.ecomarket.entity.User;
import com.ecomarket.exception.BadRequestException;
import com.ecomarket.exception.ResourceNotFoundException;
import com.ecomarket.mapper.DTOMapper;
import com.ecomarket.repository.CartItemRepository;
import com.ecomarket.repository.CartRepository;
import com.ecomarket.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CartService {

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

    public Cart getOrCreateUserCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart cart = new Cart(user);
                    return cartRepository.save(cart);
                });
    }

    public CartDTO getCart() {
        User user = authService.getCurrentUser();
        Cart cart = getOrCreateUserCart(user);
        return dtoMapper.toCartDTO(cart);
    }

    @Transactional
    public CartDTO addToCart(AddToCartRequest request) {
        User user = authService.getCurrentUser();
        Cart cart = getOrCreateUserCart(user);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (product.getStatus() != ProductStatus.APPROVED) {
            throw new BadRequestException("This product is not available for purchase");
        }

        if (product.getQuantity() <= 0) {
            throw new BadRequestException("Product is out of stock");
        }

        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            int newQuantity = existingItem.getQuantity() + request.getQuantity();

            if (newQuantity > product.getQuantity()) {
                throw new BadRequestException("Cannot add more items than available stock (" + product.getQuantity() + ")");
            }

            existingItem.setQuantity(newQuantity);
            cartItemRepository.save(existingItem);
        } else {
            if (request.getQuantity() > product.getQuantity()) {
                throw new BadRequestException("Cannot add more items than available stock (" + product.getQuantity() + ")");
            }

            CartItem newItem = new CartItem(cart, product, request.getQuantity(), product.getPrice());
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        Cart updatedCart = cartRepository.save(cart);
        return dtoMapper.toCartDTO(updatedCart);
    }

    @Transactional
    public CartDTO updateQuantity(Long itemId, UpdateCartQuantityRequest request) {
        User user = authService.getCurrentUser();
        Cart cart = getOrCreateUserCart(user);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to your cart");
        }

        Product product = item.getProduct();
        if (request.getQuantity() > product.getQuantity()) {
            throw new BadRequestException("Quantity requested exceeds available stock (" + product.getQuantity() + ")");
        }

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);

        return dtoMapper.toCartDTO(cartRepository.findById(cart.getId()).get());
    }

    @Transactional
    public CartDTO removeItem(Long itemId) {
        User user = authService.getCurrentUser();
        Cart cart = getOrCreateUserCart(user);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to your cart");
        }

        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        return dtoMapper.toCartDTO(cartRepository.findById(cart.getId()).get());
    }

    @Transactional
    public void clearCart() {
        User user = authService.getCurrentUser();
        Cart cart = getOrCreateUserCart(user);
        cart.getItems().clear();
        cartItemRepository.deleteByCartId(cart.getId());
    }
}
