package com.ecomarket.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_condition", nullable = false)
    private ProductCondition condition = ProductCondition.GOOD;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ListingType listingType = ListingType.SELL;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "college_id")
    private College college;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "campus_id")
    private Campus campus;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ProductImage> images = new ArrayList<>();

    private String brand;
    private String material;
    private String location;

    // Academic & Semester Book Fields
    private String academicYear; // Year 1, Year 2, Year 3, Year 4, PG
    private String semester;     // Sem 1, Sem 2, Sem 3, Sem 4, Sem 5, Sem 6, Sem 7, Sem 8
    private String course;       // Computer Science, Mechanical, Electrical, Management
    private String subject;      // Engineering Mathematics, Data Structures, Physics
    private String author;       // Textbook author name
    private String isbn;         // ISBN number

    // Resale & Club Flags
    private boolean isSemesterEndResale = false;
    private boolean isClubListing = false;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "club_id")
    private Club club;

    @Column(columnDefinition = "TEXT")
    private String exchangePreference; // Desired item in return if exchange

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status = ProductStatus.APPROVED;

    @Column(name = "co2_saved")
    private Double co2Saved = 0.0; // in kg

    @Column(name = "water_saved")
    private Double waterSaved = 0.0; // in Liters

    @Column(name = "waste_reduced")
    private Double wasteReduced = 0.0; // in kg

    @Column(nullable = false, updatable = false, columnDefinition = "DATETIME")
    private LocalDateTime createdAt;

    @Column(columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Product() {}

    public void addImage(String imageUrl) {
        ProductImage img = new ProductImage(imageUrl, this);
        this.images.add(img);
    }

    // Getters and Setters
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

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public User getSeller() { return seller; }
    public void setSeller(User seller) { this.seller = seller; }

    public College getCollege() { return college; }
    public void setCollege(College college) { this.college = college; }

    public Campus getCampus() { return campus; }
    public void setCampus(Campus campus) { this.campus = campus; }

    public List<ProductImage> getImages() { return images; }
    public void setImages(List<ProductImage> images) { this.images = images; }

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

    public Club getClub() { return club; }
    public void setClub(Club club) { this.club = club; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
