package com.ecomarket.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "campuses")
public class Campus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    @Column(nullable = false)
    private String name;

    private String address;

    public Campus() {}

    public Campus(College college, String name, String address) {
        this.college = college;
        this.name = name;
        this.address = address;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public College getCollege() { return college; }
    public void setCollege(College college) { this.college = college; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
