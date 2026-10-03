package com.ecomarket.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class VerifyEmailRequest {

    @NotBlank
    @Email
    private String collegeEmail;

    @NotBlank
    private String code;

    private Long collegeId;
    private Long campusId;
    private String course;
    private Integer graduationYear;

    public VerifyEmailRequest() {}

    public String getCollegeEmail() { return collegeEmail; }
    public void setCollegeEmail(String collegeEmail) { this.collegeEmail = collegeEmail; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Long getCollegeId() { return collegeId; }
    public void setCollegeId(Long collegeId) { this.collegeId = collegeId; }

    public Long getCampusId() { return campusId; }
    public void setCampusId(Long campusId) { this.campusId = campusId; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public Integer getGraduationYear() { return graduationYear; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }
}
