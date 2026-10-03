package com.ecomarket.mapper;

import com.ecomarket.dto.*;
import com.ecomarket.entity.*;
import com.ecomarket.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class DTOMapper {

    @Autowired
    private ReviewRepository reviewRepository;

    public UserDTO toUserDTO(User user) {
        if (user == null) return null;
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        dto.setProfileImage(user.getProfileImage());
        dto.setAddress(user.getAddress());
        dto.setCity(user.getCity());
        dto.setState(user.getState());
        dto.setPincode(user.getPincode());
        dto.setActive(user.isActive());
        
        if (user.getCollege() != null) {
            dto.setCollegeId(user.getCollege().getId());
            dto.setCollegeName(user.getCollege().getName());
            dto.setCollegeCode(user.getCollege().getCode());
        }
        if (user.getCampus() != null) {
            dto.setCampusId(user.getCampus().getId());
            dto.setCampusName(user.getCampus().getName());
        }
        dto.setVerifiedStudent(user.isVerifiedStudent());
        dto.setCollegeEmail(user.getCollegeEmail());
        dto.setCourse(user.getCourse());
        dto.setBranch(user.getBranch());
        dto.setGraduationYear(user.getGraduationYear());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    public CategoryDTO toCategoryDTO(Category category) {
        if (category == null) return null;
        return new CategoryDTO(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getImage()
        );
    }

    public ProductDTO toProductDTO(Product product) {
        if (product == null) return null;
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setOriginalPrice(product.getOriginalPrice());
        dto.setQuantity(product.getQuantity());
        dto.setCondition(product.getCondition());
        dto.setListingType(product.getListingType());
        dto.setCategory(toCategoryDTO(product.getCategory()));
        dto.setSeller(toUserDTO(product.getSeller()));
        
        if (product.getCollege() != null) {
            dto.setCollegeId(product.getCollege().getId());
            dto.setCollegeName(product.getCollege().getName());
            dto.setCollegeCode(product.getCollege().getCode());
        }
        if (product.getCampus() != null) {
            dto.setCampusId(product.getCampus().getId());
            dto.setCampusName(product.getCampus().getName());
        }

        List<String> imgUrls = product.getImages().stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());
        dto.setImages(imgUrls);
        
        dto.setBrand(product.getBrand());
        dto.setMaterial(product.getMaterial());
        dto.setLocation(product.getLocation());

        dto.setAcademicYear(product.getAcademicYear());
        dto.setSemester(product.getSemester());
        dto.setCourse(product.getCourse());
        dto.setSubject(product.getSubject());
        dto.setAuthor(product.getAuthor());
        dto.setIsbn(product.getIsbn());

        dto.setSemesterEndResale(product.isSemesterEndResale());
        dto.setClubListing(product.isClubListing());
        if (product.getClub() != null) {
            dto.setClubId(product.getClub().getId());
            dto.setClubName(product.getClub().getName());
        }
        dto.setExchangePreference(product.getExchangePreference());

        dto.setStatus(product.getStatus());
        dto.setCo2Saved(product.getCo2Saved());
        dto.setWaterSaved(product.getWaterSaved());
        dto.setWasteReduced(product.getWasteReduced());
        dto.setCreatedAt(product.getCreatedAt());

        Double avgRating = reviewRepository.getAverageRatingForProduct(product.getId());
        dto.setRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
        
        long reviewCount = reviewRepository.countByProductId(product.getId());
        dto.setReviewCount(reviewCount);

        return dto;
    }

    public CollegeDTO toCollegeDTO(College college) {
        if (college == null) return null;
        return new CollegeDTO(
                college.getId(),
                college.getName(),
                college.getCode(),
                college.getEmailDomain(),
                college.getLocation(),
                college.getLogoUrl()
        );
    }

    public CampusDTO toCampusDTO(Campus campus) {
        if (campus == null) return null;
        return new CampusDTO(
                campus.getId(),
                campus.getCollege() != null ? campus.getCollege().getId() : null,
                campus.getCollege() != null ? campus.getCollege().getName() : null,
                campus.getName(),
                campus.getAddress()
        );
    }

    public ClubDTO toClubDTO(Club club) {
        if (club == null) return null;
        ClubDTO dto = new ClubDTO();
        dto.setId(club.getId());
        dto.setName(club.getName());
        if (club.getCollege() != null) {
            dto.setCollegeId(club.getCollege().getId());
            dto.setCollegeName(club.getCollege().getName());
        }
        dto.setDescription(club.getDescription());
        dto.setCategory(club.getCategory());
        if (club.getClubRep() != null) {
            dto.setClubRepName(club.getClubRep().getName());
            dto.setClubRepEmail(club.getClubRep().getEmail());
        }
        dto.setVerified(club.isVerified());
        dto.setLogoUrl(club.getLogoUrl());
        return dto;
    }

    public MarketplaceRequestDTO toMarketplaceRequestDTO(MarketplaceRequest req) {
        if (req == null) return null;
        MarketplaceRequestDTO dto = new MarketplaceRequestDTO();
        dto.setId(req.getId());
        if (req.getProduct() != null) {
            dto.setProductId(req.getProduct().getId());
            dto.setProductName(req.getProduct().getName());
            String img = req.getProduct().getImages().isEmpty() ? null : req.getProduct().getImages().get(0).getImageUrl();
            dto.setProductImage(img);
            dto.setProductPrice(req.getProduct().getPrice().toString());
        }
        if (req.getBuyer() != null) {
            dto.setBuyerId(req.getBuyer().getId());
            dto.setBuyerName(req.getBuyer().getName());
            dto.setBuyerEmail(req.getBuyer().getEmail());
            if (req.getBuyer().getCollege() != null) {
                dto.setBuyerCollege(req.getBuyer().getCollege().getName());
            }
        }
        if (req.getSeller() != null) {
            dto.setSellerId(req.getSeller().getId());
            dto.setSellerName(req.getSeller().getName());
            dto.setSellerEmail(req.getSeller().getEmail());
            if (req.getSeller().getCollege() != null) {
                dto.setSellerCollege(req.getSeller().getCollege().getName());
            }
        }
        dto.setRequestType(req.getRequestType());
        dto.setStatus(req.getStatus());
        dto.setMessage(req.getMessage());
        if (req.getOfferedProduct() != null) {
            dto.setOfferedProductId(req.getOfferedProduct().getId());
            dto.setOfferedProductName(req.getOfferedProduct().getName());
        }
        dto.setPickupLocation(req.getPickupLocation());
        dto.setCreatedAt(req.getCreatedAt());
        dto.setUpdatedAt(req.getUpdatedAt());
        return dto;
    }

    public CartItemDTO toCartItemDTO(CartItem item) {
        if (item == null) return null;
        CartItemDTO dto = new CartItemDTO();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setProductPrice(item.getPrice());
        
        String mainImg = item.getProduct().getImages().isEmpty() ? null : item.getProduct().getImages().get(0).getImageUrl();
        dto.setProductImage(mainImg);
        
        dto.setCondition(item.getProduct().getCondition());
        dto.setQuantity(item.getQuantity());
        dto.setSubtotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        dto.setSellerId(item.getProduct().getSeller().getId());
        dto.setSellerName(item.getProduct().getSeller().getName());
        dto.setAvailableStock(item.getProduct().getQuantity());
        dto.setCo2Saved((item.getProduct().getCo2Saved() != null ? item.getProduct().getCo2Saved() : 0.0) * item.getQuantity());
        dto.setWaterSaved((item.getProduct().getWaterSaved() != null ? item.getProduct().getWaterSaved() : 0.0) * item.getQuantity());
        dto.setWasteReduced((item.getProduct().getWasteReduced() != null ? item.getProduct().getWasteReduced() : 0.0) * item.getQuantity());

        return dto;
    }

    public CartDTO toCartDTO(Cart cart) {
        if (cart == null) return null;
        CartDTO dto = new CartDTO();
        dto.setId(cart.getId());
        
        List<CartItemDTO> itemDTOs = cart.getItems().stream()
                .map(this::toCartItemDTO)
                .collect(Collectors.toList());
        dto.setItems(itemDTOs);

        BigDecimal subtotal = BigDecimal.ZERO;
        double co2 = 0.0;
        double water = 0.0;
        double waste = 0.0;

        for (CartItemDTO item : itemDTOs) {
            subtotal = subtotal.add(item.getSubtotal());
            co2 += item.getCo2Saved() != null ? item.getCo2Saved() : 0.0;
            water += item.getWaterSaved() != null ? item.getWaterSaved() : 0.0;
            waste += item.getWasteReduced() != null ? item.getWasteReduced() : 0.0;
        }

        dto.setSubtotal(subtotal);
        BigDecimal deliveryFee = subtotal.compareTo(BigDecimal.ZERO) > 0 && subtotal.compareTo(new BigDecimal("1000")) < 0 
                ? new BigDecimal("99.00") 
                : BigDecimal.ZERO;
        dto.setDeliveryFee(deliveryFee);
        dto.setTotalAmount(subtotal.add(deliveryFee));
        dto.setCo2Saved(Math.round(co2 * 100.0) / 100.0);
        dto.setWaterSaved(Math.round(water * 100.0) / 100.0);
        dto.setWasteReduced(Math.round(waste * 100.0) / 100.0);

        return dto;
    }

    public OrderItemDTO toOrderItemDTO(OrderItem item) {
        if (item == null) return null;
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        
        String mainImg = item.getProduct().getImages().isEmpty() ? null : item.getProduct().getImages().get(0).getImageUrl();
        dto.setProductImage(mainImg);
        
        dto.setCondition(item.getProduct().getCondition());
        dto.setSellerId(item.getSeller().getId());
        dto.setSellerName(item.getSeller().getName());
        dto.setQuantity(item.getQuantity());
        dto.setPrice(item.getPrice());
        dto.setSubtotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        return dto;
    }

    public OrderTrackingHistoryDTO toOrderTrackingHistoryDTO(OrderTrackingHistory history) {
        if (history == null) return null;
        return new OrderTrackingHistoryDTO(
                history.getId(),
                history.getStatus(),
                history.getTitle(),
                history.getDescription(),
                history.getLocation(),
                history.getTimestamp()
        );
    }

    public OrderDTO toOrderDTO(Order order) {
        if (order == null) return null;
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setSubtotal(order.getSubtotal());
        dto.setDeliveryFee(order.getDeliveryFee());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setCity(order.getCity());
        dto.setState(order.getState());
        dto.setPincode(order.getPincode());
        dto.setPhone(order.getPhone());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setPaymentMethod(order.getPaymentMethod());

        dto.setHandoverMethod(order.getHandoverMethod());
        dto.setPickupLocation(order.getPickupLocation());
        dto.setPreferredTimeSlot(order.getPreferredTimeSlot());
        dto.setHandoverCode(order.getHandoverCode());
        
        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                .map(this::toOrderItemDTO)
                .collect(Collectors.toList());
        dto.setItems(itemDTOs);

        if (order.getTrackingHistory() != null) {
            List<OrderTrackingHistoryDTO> trackingDTOs = order.getTrackingHistory().stream()
                    .map(this::toOrderTrackingHistoryDTO)
                    .collect(Collectors.toList());
            dto.setTrackingHistory(trackingDTOs);
        }

        if (order.getBuyer() != null) {
            dto.setBuyerId(order.getBuyer().getId());
            dto.setBuyerName(order.getBuyer().getName());
            dto.setBuyerEmail(order.getBuyer().getEmail());
        }

        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        return dto;
    }

    public ReviewDTO toReviewDTO(Review review) {
        if (review == null) return null;
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setUserId(review.getUser().getId());
        dto.setUserName(review.getUser().getName());
        dto.setUserProfileImage(review.getUser().getProfileImage());
        dto.setProductId(review.getProduct().getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}
