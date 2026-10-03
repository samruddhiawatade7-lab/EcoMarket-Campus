package com.ecomarket.repository;

import com.ecomarket.entity.ListingType;
import com.ecomarket.entity.Product;
import com.ecomarket.entity.ProductCondition;
import com.ecomarket.entity.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByStatus(ProductStatus status, Pageable pageable);

    Page<Product> findBySellerId(Long sellerId, Pageable pageable);
    
    Page<Product> findBySellerIdAndStatus(Long sellerId, ProductStatus status, Pageable pageable);

    long countByStatus(ProductStatus status);

    long countBySellerId(Long sellerId);

    @Query("SELECT p FROM Product p WHERE p.status = :status AND " +
           "(:query IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.author) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.subject) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.category.name) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:category IS NULL OR LOWER(p.category.name) = LOWER(:category)) AND " +
           "(:condition IS NULL OR p.condition = :condition) AND " +
           "(:listingType IS NULL OR p.listingType = :listingType) AND " +
           "(:collegeId IS NULL OR p.college.id = :collegeId) AND " +
           "(:campusId IS NULL OR p.campus.id = :campusId) AND " +
           "(:semester IS NULL OR p.semester = :semester) AND " +
           "(:course IS NULL OR LOWER(p.course) LIKE LOWER(CONCAT('%', :course, '%'))) AND " +
           "(:isSemesterEndResale IS NULL OR p.isSemesterEndResale = :isSemesterEndResale) AND " +
           "(:isClubListing IS NULL OR p.isClubListing = :isClubListing) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    Page<Product> filterCampusProducts(
            @Param("status") ProductStatus status,
            @Param("query") String query,
            @Param("category") String category,
            @Param("condition") ProductCondition condition,
            @Param("listingType") ListingType listingType,
            @Param("collegeId") Long collegeId,
            @Param("campusId") Long campusId,
            @Param("semester") String semester,
            @Param("course") String course,
            @Param("isSemesterEndResale") Boolean isSemesterEndResale,
            @Param("isClubListing") Boolean isClubListing,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );

    @Query("SELECT p FROM Product p WHERE p.status = 'APPROVED' ORDER BY p.createdAt DESC")
    List<Product> findTopFeaturedProducts(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.status = 'APPROVED' AND p.category.id = :categoryId AND p.id != :excludeProductId")
    List<Product> findSimilarProducts(@Param("categoryId") Long categoryId, @Param("excludeProductId") Long excludeProductId, Pageable pageable);

    List<Product> findByCollegeIdAndStatus(Long collegeId, ProductStatus status);
}
