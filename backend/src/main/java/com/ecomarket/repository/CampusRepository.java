package com.ecomarket.repository;

import com.ecomarket.entity.Campus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampusRepository extends JpaRepository<Campus, Long> {
    List<Campus> findByCollegeId(Long collegeId);
}
