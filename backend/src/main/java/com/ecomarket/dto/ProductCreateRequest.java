package com.ecomarket.dto;

import com.ecomarket.entity.ListingType;
import com.ecomarket.entity.ProductCondition;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;

public class ProductCreateRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.00", message = "Price cannot be negative")
    private BigDecimal price = BigDecimal.ZERO;

    private BigDecimal originalPrice;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity = 1;

    @NotNull(message = "Condition is required")
    private ProductCondition condition = ProductCondition.GOOD;

    private ListingType listingType = ListingType.SELL;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private Long collegeId;
    private Long campusId;

    private String brand;
    private String material;
    private String location;
    private List<String> images;

    // Academic & Semester Fields
    private String academicYear;
    private String semester;
    private String course;
    private String subject;
    private String author;
    private String isbn;

    private Boolean isSemesterEndResale = false;
    private Boolean isClubListing = false;
    private Long clubId;
    private String exchangePreference;

    public ProductCreateRequest() {}

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

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public Long getCollegeId() { return collegeId; }
    public void setCollegeId(Long collegeId) { this.collegeId = collegeId; }

    public Long getCampusId() { return campusId; }
    public void setCampusId(Long campusId) { this.campusId = campusId; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

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

    public Boolean getIsSemesterEndResale() { return isSemesterEndResale; }
    public void setIsSemesterEndResale(Boolean isSemesterEndResale) { this.isSemesterEndResale = isSemesterEndResale; }

    public Boolean getIsClubListing() { return isClubListing; }
    public void setIsClubListing(Boolean isClubListing) { this.isClubListing = isClubListing; }

    public Long getClubId() { return clubId; }
    public void setClubId(Long clubId) { this.clubId = clubId; }

    public String getExchangePreference() { return exchangePreference; }
    public void setExchangePreference(String exchangePreference) { this.exchangePreference = exchangePreference; }
}
