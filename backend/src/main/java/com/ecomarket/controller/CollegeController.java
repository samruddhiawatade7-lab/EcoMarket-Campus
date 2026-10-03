package com.ecomarket.controller;

import com.ecomarket.dto.CampusDTO;
import com.ecomarket.dto.CollegeDTO;
import com.ecomarket.service.CollegeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colleges")
public class CollegeController {

    @Autowired
    private CollegeService collegeService;

    @GetMapping
    public ResponseEntity<List<CollegeDTO>> getAllColleges() {
        return ResponseEntity.ok(collegeService.getAllColleges());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CollegeDTO> getCollegeById(@PathVariable Long id) {
        return ResponseEntity.ok(collegeService.getCollegeById(id));
    }

    @GetMapping("/{id}/campuses")
    public ResponseEntity<List<CampusDTO>> getCampusesByCollege(@PathVariable Long id) {
        return ResponseEntity.ok(collegeService.getCampusesByCollege(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CollegeDTO> createCollege(@RequestBody CollegeDTO dto) {
        return ResponseEntity.ok(collegeService.createCollege(dto));
    }

    @PostMapping("/{collegeId}/campuses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CampusDTO> createCampus(@PathVariable Long collegeId, @RequestBody CampusDTO dto) {
        return ResponseEntity.ok(collegeService.createCampus(collegeId, dto));
    }
}
