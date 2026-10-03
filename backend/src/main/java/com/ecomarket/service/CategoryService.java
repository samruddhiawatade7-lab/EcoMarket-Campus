package com.ecomarket.service;

import com.ecomarket.dto.CategoryDTO;
import com.ecomarket.entity.Category;
import com.ecomarket.exception.BadRequestException;
import com.ecomarket.exception.ResourceNotFoundException;
import com.ecomarket.mapper.DTOMapper;
import com.ecomarket.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private DTOMapper dtoMapper;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(dtoMapper::toCategoryDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return dtoMapper.toCategoryDTO(category);
    }

    @Transactional
    public CategoryDTO createCategory(CategoryDTO dto) {
        if (categoryRepository.existsByNameIgnoreCase(dto.getName())) {
            throw new BadRequestException("Category with name '" + dto.getName() + "' already exists");
        }
        Category category = new Category(dto.getName(), dto.getDescription(), dto.getImage());
        Category saved = categoryRepository.save(category);
        return dtoMapper.toCategoryDTO(saved);
    }

    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        if (!category.getName().equalsIgnoreCase(dto.getName()) && categoryRepository.existsByNameIgnoreCase(dto.getName())) {
            throw new BadRequestException("Category with name '" + dto.getName() + "' already exists");
        }

        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        if (dto.getImage() != null) category.setImage(dto.getImage());

        Category updated = categoryRepository.save(category);
        return dtoMapper.toCategoryDTO(updated);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }
}
