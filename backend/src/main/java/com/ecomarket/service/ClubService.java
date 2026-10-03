package com.ecomarket.service;

import com.ecomarket.dto.ClubDTO;
import com.ecomarket.entity.Club;
import com.ecomarket.entity.College;
import com.ecomarket.entity.User;
import com.ecomarket.exception.ResourceNotFoundException;
import com.ecomarket.mapper.DTOMapper;
import com.ecomarket.repository.ClubRepository;
import com.ecomarket.repository.CollegeRepository;
import com.ecomarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClubService {

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DTOMapper dtoMapper;

    public List<ClubDTO> getAllClubs() {
        return clubRepository.findAll().stream()
                .map(dtoMapper::toClubDTO)
                .collect(Collectors.toList());
    }

    public List<ClubDTO> getClubsByCollege(Long collegeId) {
        return clubRepository.findByCollegeId(collegeId).stream()
                .map(dtoMapper::toClubDTO)
                .collect(Collectors.toList());
    }

    public ClubDTO createClub(ClubDTO dto) {
        College college = collegeRepository.findById(dto.getCollegeId())
                .orElseThrow(() -> new ResourceNotFoundException("College not found with id: " + dto.getCollegeId()));
        User rep = null;
        if (dto.getClubRepEmail() != null) {
            rep = userRepository.findByEmail(dto.getClubRepEmail()).orElse(null);
        }
        Club club = new Club(dto.getName(), college, dto.getDescription(), dto.getCategory(), rep, dto.getLogoUrl());
        Club saved = clubRepository.save(club);
        return dtoMapper.toClubDTO(saved);
    }
}
