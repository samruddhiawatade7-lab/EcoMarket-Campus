package com.ecomarket.controller;

import com.ecomarket.dto.ClubDTO;
import com.ecomarket.service.ClubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clubs")
public class ClubController {

    @Autowired
    private ClubService clubService;

    @GetMapping
    public ResponseEntity<List<ClubDTO>> getAllClubs(@RequestParam(required = false) Long collegeId) {
        if (collegeId != null) {
            return ResponseEntity.ok(clubService.getClubsByCollege(collegeId));
        }
        return ResponseEntity.ok(clubService.getAllClubs());
    }

    @PostMapping
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<ClubDTO> createClub(@RequestBody ClubDTO dto) {
        return ResponseEntity.ok(clubService.createClub(dto));
    }
}
