package com.ecomarket.dto;

public class ClubDTO {
    private Long id;
    private String name;
    private Long collegeId;
    private String collegeName;
    private String description;
    private String category;
    private String clubRepName;
    private String clubRepEmail;
    private boolean verified;
    private String logoUrl;

    public ClubDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getCollegeId() { return collegeId; }
    public void setCollegeId(Long collegeId) { this.collegeId = collegeId; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getClubRepName() { return clubRepName; }
    public void setClubRepName(String clubRepName) { this.clubRepName = clubRepName; }

    public String getClubRepEmail() { return clubRepEmail; }
    public void setClubRepEmail(String clubRepEmail) { this.clubRepEmail = clubRepEmail; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
}
