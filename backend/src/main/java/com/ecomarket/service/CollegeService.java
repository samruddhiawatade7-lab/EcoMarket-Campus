package com.ecomarket.service;

import com.ecomarket.dto.CampusDTO;
import com.ecomarket.dto.CollegeDTO;
import com.ecomarket.entity.Campus;
import com.ecomarket.entity.College;
import com.ecomarket.exception.ResourceNotFoundException;
import com.ecomarket.mapper.DTOMapper;
import com.ecomarket.repository.CampusRepository;
import com.ecomarket.repository.CollegeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CollegeService {

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private CampusRepository campusRepository;

    @Autowired
    private DTOMapper dtoMapper;

    public List<CollegeDTO> getAllColleges() {
        return collegeRepository.findAll().stream()
                .map(c -> {
                    CollegeDTO dto = dtoMapper.toCollegeDTO(c);
                    List<CampusDTO> campuses = campusRepository.findByCollegeId(c.getId()).stream()
                            .map(dtoMapper::toCampusDTO)
                            .collect(Collectors.toList());
                    dto.setCampuses(campuses);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public CollegeDTO getCollegeById(Long id) {
        College college = collegeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("College not found with id: " + id));
        CollegeDTO dto = dtoMapper.toCollegeDTO(college);
        List<CampusDTO> campuses = campusRepository.findByCollegeId(college.getId()).stream()
                .map(dtoMapper::toCampusDTO)
                .collect(Collectors.toList());
        dto.setCampuses(campuses);
        return dto;
    }

    public List<CampusDTO> getCampusesByCollege(Long collegeId) {
        return campusRepository.findByCollegeId(collegeId).stream()
                .map(dtoMapper::toCampusDTO)
                .collect(Collectors.toList());
    }

    public CollegeDTO createCollege(CollegeDTO dto) {
        College college = new College(dto.getName(), dto.getCode(), dto.getEmailDomain(), dto.getLocation(), dto.getLogoUrl());
        College saved = collegeRepository.save(college);
        return dtoMapper.toCollegeDTO(saved);
    }

    public CampusDTO createCampus(Long collegeId, CampusDTO dto) {
        College college = collegeRepository.findById(collegeId)
                .orElseThrow(() -> new ResourceNotFoundException("College not found with id: " + collegeId));
        Campus campus = new Campus(college, dto.getName(), dto.getAddress());
        Campus saved = campusRepository.save(campus);
        return dtoMapper.toCampusDTO(saved);
    }
}
