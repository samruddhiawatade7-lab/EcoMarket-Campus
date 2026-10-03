package com.ecomarket.dto;

import com.ecomarket.entity.ListingType;
import com.ecomarket.entity.ProductCondition;
import com.ecomarket.entity.ProductStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer quantity;
    private ProductCondition condition;
    private ListingType listingType;
    private CategoryDTO category;
    private UserDTO seller;

    private Long collegeId;
    private String collegeName;
    private String collegeCode;
    private Long campusId;
    private String campusName;

    private List<String> images;
    private String brand;
    private String material;
    private String location;

    private String academicYear;
    private String semester;
    private String course;
    private String subject;
    private String author;
    private String isbn;

    private boolean isSemesterEndResale;
    private boolean isClubListing;
    private Long clubId;
    private String clubName;
    private String exchangePreference;

    private ProductStatus status;
    private Double co2Saved;
    private Double waterSaved;
    private Double wasteReduced;
    private Double rating;
    private Long reviewCount;
    private LocalDateTime createdAt;

    public ProductDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public ProductCondition getCondition() { return condition; }
    public void setCondition(ProductCondition condition) { this.condition = condition; }

    public ListingType getListingType() { return listingType; }
    public void setListingType(ListingType listingType) { this.listingType = listingType; }

    public CategoryDTO getCategory() { return category; }
    public void setCategory(CategoryDTO category) { this.category = category; }

    public UserDTO getSeller() { return seller; }
    public void setSeller(UserDTO seller) { this.seller = seller; }

    public Long getCollegeId() { return collegeId; }
    public void setCollegeId(Long collegeId) { this.collegeId = collegeId; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }

    public String getCollegeCode() { return collegeCode; }
    public void setCollegeCode(String collegeCode) { this.collegeCode = collegeCode; }

    public Long getCampusId() { return campusId; }
    public void setCampusId(Long campusId) { this.campusId = campusId; }

    public String getCampusName() { return campusName; }
    public void setCampusName(String campusName) { this.campusName = campusName; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public boolean isSemesterEndResale() { return isSemesterEndResale; }
    public void setSemesterEndResale(boolean semesterEndResale) { isSemesterEndResale = semesterEndResale; }

    public boolean isClubListing() { return isClubListing; }
    public void setClubListing(boolean clubListing) { isClubListing = clubListing; }

    public Long getClubId() { return clubId; }
    public void setClubId(Long clubId) { this.clubId = clubId; }

    public String getClubName() { return clubName; }
    public void setClubName(String clubName) { this.clubName = clubName; }

    public String getExchangePreference() { return exchangePreference; }
    public void setExchangePreference(String exchangePreference) { this.exchangePreference = exchangePreference; }

    public ProductStatus getStatus() { return status; }
    public void setStatus(ProductStatus status) { this.status = status; }

    public Double getCo2Saved() { return co2Saved; }
    public void setCo2Saved(Double co2Saved) { this.co2Saved = co2Saved; }

    public Double getWaterSaved() { return waterSaved; }
    public void setWaterSaved(Double waterSaved) { this.waterSaved = waterSaved; }

    public Double getWasteReduced() { return wasteReduced; }
    public void setWasteReduced(Double wasteReduced) { this.wasteReduced = wasteReduced; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Long getReviewCount() { return reviewCount; }
    public void setReviewCount(Long reviewCount) { this.reviewCount = reviewCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
