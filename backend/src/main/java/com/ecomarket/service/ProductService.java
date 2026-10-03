package com.ecomarket.service;

import com.ecomarket.dto.ProductCreateRequest;
import com.ecomarket.dto.ProductDTO;
import com.ecomarket.entity.*;
import com.ecomarket.exception.ResourceNotFoundException;
import com.ecomarket.exception.UnauthorizedException;
import com.ecomarket.mapper.DTOMapper;
import com.ecomarket.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private CampusRepository campusRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private SustainabilityImpactRepository sustainabilityImpactRepository;

    @Autowired
    private SustainabilityService sustainabilityService;

    @Autowired
    private AuthService authService;

    @Autowired
    private DTOMapper dtoMapper;

    public Page<ProductDTO> getProducts(
            String query,
            String category,
            ProductCondition condition,
            ListingType listingType,
            Long collegeId,
            Long campusId,
            String semester,
            String course,
            Boolean isSemesterEndResale,
            Boolean isClubListing,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String sortBy,
            int page,
            int size
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if (sortBy != null) {
            switch (sortBy.toLowerCase()) {
                case "price_asc" -> sort = Sort.by(Sort.Direction.ASC, "price");
                case "price_desc" -> sort = Sort.by(Sort.Direction.DESC, "price");
                case "newest" -> sort = Sort.by(Sort.Direction.DESC, "createdAt");
            }
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> products = productRepository.filterCampusProducts(
                ProductStatus.APPROVED, query, category, condition, listingType, collegeId, campusId,
                semester, course, isSemesterEndResale, isClubListing, minPrice, maxPrice, pageable
        );

        return products.map(dtoMapper::toProductDTO);
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return dtoMapper.toProductDTO(product);
    }

    @Transactional
    public ProductDTO createProduct(ProductCreateRequest request) {
        User user = authService.getCurrentUser();

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice() != null ? request.getPrice() : BigDecimal.ZERO);
        product.setOriginalPrice(request.getOriginalPrice() != null ? request.getOriginalPrice() : request.getPrice());
        product.setQuantity(request.getQuantity() != null ? request.getQuantity() : 1);
        product.setCondition(request.getCondition() != null ? request.getCondition() : ProductCondition.GOOD);
        product.setListingType(request.getListingType() != null ? request.getListingType() : ListingType.SELL);
        product.setCategory(category);
        product.setSeller(user);

        // Assign College & Campus (from request or fallback to seller's college)
        Long collegeId = request.getCollegeId() != null ? request.getCollegeId() : (user.getCollege() != null ? user.getCollege().getId() : null);
        if (collegeId != null) {
            College college = collegeRepository.findById(collegeId).orElse(null);
            product.setCollege(college);
        }
        Long campusId = request.getCampusId() != null ? request.getCampusId() : (user.getCampus() != null ? user.getCampus().getId() : null);
        if (campusId != null) {
            Campus campus = campusRepository.findById(campusId).orElse(null);
            product.setCampus(campus);
        }

        product.setBrand(request.getBrand());
        product.setMaterial(request.getMaterial());
        product.setLocation(request.getLocation() != null ? request.getLocation() : (user.getCity() != null ? user.getCity() : "Campus"));

        product.setAcademicYear(request.getAcademicYear());
        product.setSemester(request.getSemester());
        product.setCourse(request.getCourse() != null ? request.getCourse() : user.getCourse());
        product.setSubject(request.getSubject());
        product.setAuthor(request.getAuthor());
        product.setIsbn(request.getIsbn());

        if (Boolean.TRUE.equals(request.getIsSemesterEndResale())) {
            product.setSemesterEndResale(true);
        }
        if (Boolean.TRUE.equals(request.getIsClubListing())) {
            product.setClubListing(true);
            if (request.getClubId() != null) {
                Club club = clubRepository.findById(request.getClubId()).orElse(null);
                product.setClub(club);
            }
        }
        product.setExchangePreference(request.getExchangePreference());

        // Products are auto approved for verified students & active users
        product.setStatus(ProductStatus.APPROVED);

        // Calculate environmental impact metrics
        double co2 = sustainabilityService.estimateCo2Saved(request.getCondition(), category.getName());
        double water = sustainabilityService.estimateWaterSaved(request.getCondition(), category.getName());
        double waste = sustainabilityService.estimateWasteReduced(request.getCondition(), category.getName());

        product.setCo2Saved(co2);
        product.setWaterSaved(water);
        product.setWasteReduced(waste);

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            for (String imgUrl : request.getImages()) {
                product.addImage(imgUrl);
            }
        } else {
            product.addImage("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60");
        }

        Product savedProduct = productRepository.save(product);

        SustainabilityImpact impact = new SustainabilityImpact(
                savedProduct, co2, water, waste, "Estimated reuse impact for student marketplace"
        );
        sustainabilityImpactRepository.save(impact);

        return dtoMapper.toProductDTO(savedProduct);
    }

    @Transactional
    public ProductDTO updateProduct(Long id, ProductCreateRequest request) {
        User user = authService.getCurrentUser();
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (!product.getSeller().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You are not authorized to update this product");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice() != null ? request.getPrice() : BigDecimal.ZERO);
        if (request.getOriginalPrice() != null) product.setOriginalPrice(request.getOriginalPrice());
        product.setQuantity(request.getQuantity());
        product.setCondition(request.getCondition());
        if (request.getListingType() != null) product.setListingType(request.getListingType());
        product.setCategory(category);
        
        if (request.getAcademicYear() != null) product.setAcademicYear(request.getAcademicYear());
        if (request.getSemester() != null) product.setSemester(request.getSemester());
        if (request.getCourse() != null) product.setCourse(request.getCourse());
        if (request.getSubject() != null) product.setSubject(request.getSubject());
        if (request.getAuthor() != null) product.setAuthor(request.getAuthor());
        if (request.getIsbn() != null) product.setIsbn(request.getIsbn());
        if (request.getExchangePreference() != null) product.setExchangePreference(request.getExchangePreference());

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            product.getImages().clear();
            for (String imgUrl : request.getImages()) {
                product.addImage(imgUrl);
            }
        }

        Product updatedProduct = productRepository.save(product);
        return dtoMapper.toProductDTO(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        User user = authService.getCurrentUser();
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (!product.getSeller().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You are not authorized to delete this product");
        }

        productRepository.delete(product);
    }

    public Page<ProductDTO> getSellerProducts(Pageable pageable) {
        User user = authService.getCurrentUser();
        Page<Product> products = productRepository.findBySellerId(user.getId(), pageable);
        return products.map(dtoMapper::toProductDTO);
    }

    public Page<ProductDTO> getPendingProducts(Pageable pageable) {
        Page<Product> products = productRepository.findByStatus(ProductStatus.PENDING, pageable);
        return products.map(dtoMapper::toProductDTO);
    }

    @Transactional
    public ProductDTO approveProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setStatus(ProductStatus.APPROVED);
        Product saved = productRepository.save(product);
        return dtoMapper.toProductDTO(saved);
    }

    @Transactional
    public ProductDTO rejectProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setStatus(ProductStatus.REJECTED);
        Product saved = productRepository.save(product);
        return dtoMapper.toProductDTO(saved);
    }

    public List<ProductDTO> getFeaturedProducts() {
        Pageable pageable = PageRequest.of(0, 8);
        return productRepository.findTopFeaturedProducts(pageable).stream()
                .map(dtoMapper::toProductDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getSimilarProducts(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        
        Pageable pageable = PageRequest.of(0, 4);
        return productRepository.findSimilarProducts(product.getCategory().getId(), productId, pageable).stream()
                .map(dtoMapper::toProductDTO)
                .collect(Collectors.toList());
    }
}
