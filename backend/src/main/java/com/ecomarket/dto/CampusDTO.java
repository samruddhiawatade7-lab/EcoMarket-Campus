package com.ecomarket.dto;

public class CampusDTO {
    private Long id;
    private Long collegeId;
    private String collegeName;
    private String name;
    private String address;

    public CampusDTO() {}

    public CampusDTO(Long id, Long collegeId, String collegeName, String name, String address) {
        this.id = id;
        this.collegeId = collegeId;
        this.collegeName = collegeName;
        this.name = name;
        this.address = address;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCollegeId() { return collegeId; }
    public void setCollegeId(Long collegeId) { this.collegeId = collegeId; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
