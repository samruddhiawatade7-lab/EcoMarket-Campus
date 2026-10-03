package com.ecomarket.service;

import com.ecomarket.dto.ChangePasswordRequest;
import com.ecomarket.dto.UpdateProfileRequest;
import com.ecomarket.dto.UserDTO;
import com.ecomarket.entity.Role;
import com.ecomarket.entity.User;
import com.ecomarket.exception.BadRequestException;
import com.ecomarket.exception.ResourceNotFoundException;
import com.ecomarket.mapper.DTOMapper;
import com.ecomarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DTOMapper dtoMapper;

    @Transactional
    public UserDTO updateProfile(UpdateProfileRequest request) {
        User user = authService.getCurrentUser();
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        if (request.getProfileImage() != null) user.setProfileImage(request.getProfileImage());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getCity() != null) user.setCity(request.getCity());
        if (request.getState() != null) user.setState(request.getState());
        if (request.getPincode() != null) user.setPincode(request.getPincode());

        User updated = userRepository.save(user);
        return dtoMapper.toUserDTO(updated);
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User user = authService.getCurrentUser();
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public Page<UserDTO> getUsers(String query, Role role, Pageable pageable) {
        Page<User> users = userRepository.searchUsers(query, role, pageable);
        return users.map(dtoMapper::toUserDTO);
    }

    @Transactional
    public UserDTO toggleUserStatus(Long userId) {
        User currentUser = authService.getCurrentUser();
        if (currentUser.getId().equals(userId)) {
            throw new BadRequestException("Administrators cannot deactivate their own account");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setActive(!user.isActive());
        User updated = userRepository.save(user);
        return dtoMapper.toUserDTO(updated);
    }
}
