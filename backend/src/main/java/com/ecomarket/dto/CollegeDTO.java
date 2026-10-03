package com.ecomarket.dto;

import java.util.List;

public class CollegeDTO {
    private Long id;
    private String name;
    private String code;
    private String emailDomain;
    private String location;
    private String logoUrl;
    private List<CampusDTO> campuses;

    public CollegeDTO() {}

    public CollegeDTO(Long id, String name, String code, String emailDomain, String location, String logoUrl) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.emailDomain = emailDomain;
        this.location = location;
        this.logoUrl = logoUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getEmailDomain() { return emailDomain; }
    public void setEmailDomain(String emailDomain) { this.emailDomain = emailDomain; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public List<CampusDTO> getCampuses() { return campuses; }
    public void setCampuses(List<CampusDTO> campuses) { this.campuses = campuses; }
}
