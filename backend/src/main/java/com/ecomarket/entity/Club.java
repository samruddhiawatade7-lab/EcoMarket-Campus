package com.ecomarket.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "clubs")
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category; // Cultural, Tech, Sports, Eco, Literary

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "club_rep_id")
    private User clubRep;

    private boolean verified = true;

    private String logoUrl;

    @Column(nullable = false, updatable = false, columnDefinition = "DATETIME")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Club() {}

    public Club(String name, College college, String description, String category, User clubRep, String logoUrl) {
        this.name = name;
        this.college = college;
        this.description = description;
        this.category = category;
        this.clubRep = clubRep;
        this.verified = true;
        this.logoUrl = logoUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public College getCollege() { return college; }
    public void setCollege(College college) { this.college = college; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public User getClubRep() { return clubRep; }
    public void setClubRep(User clubRep) { this.clubRep = clubRep; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
