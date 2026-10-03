package com.ecomarket.service;

import com.ecomarket.dto.AuthRequest;
import com.ecomarket.dto.AuthResponse;
import com.ecomarket.dto.RegisterRequest;
import com.ecomarket.dto.UserDTO;
import com.ecomarket.dto.VerifyEmailRequest;
import com.ecomarket.entity.Campus;
import com.ecomarket.entity.Cart;
import com.ecomarket.entity.College;
import com.ecomarket.entity.User;
import com.ecomarket.exception.BadRequestException;
import com.ecomarket.exception.ResourceNotFoundException;
import com.ecomarket.exception.UnauthorizedException;
import com.ecomarket.mapper.DTOMapper;
import com.ecomarket.repository.CampusRepository;
import com.ecomarket.repository.CartRepository;
import com.ecomarket.repository.CollegeRepository;
import com.ecomarket.repository.UserRepository;
import com.ecomarket.security.JwtUtils;
import com.ecomarket.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private CampusRepository campusRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private DTOMapper dtoMapper;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getPhone(),
                request.getRole()
        );

        if (request.getCollegeId() != null) {
            College college = collegeRepository.findById(request.getCollegeId()).orElse(null);
            user.setCollege(college);
        }
        if (request.getCampusId() != null) {
            Campus campus = campusRepository.findById(request.getCampusId()).orElse(null);
            user.setCampus(campus);
        }

        user.setCollegeEmail(request.getCollegeEmail());
        user.setCourse(request.getCourse());
        user.setBranch(request.getBranch());
        user.setGraduationYear(request.getGraduationYear());

        // Default test verification code: 123456
        user.setVerificationCode("123456");
        user.setVerificationExpiry(LocalDateTime.now().plusHours(24));

        // Auto verify if email ends with valid college domain or test user
        if (user.getCollege() != null && user.getCollegeEmail() != null &&
            user.getCollegeEmail().toLowerCase().endsWith(user.getCollege().getEmailDomain().toLowerCase())) {
            user.setVerifiedStudent(true);
        }

        User savedUser = userRepository.save(user);

        // Create empty shopping cart for new user
        Cart cart = new Cart(savedUser);
        cartRepository.save(cart);

        // Authenticate and generate token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        return new AuthResponse(
                jwt,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getProfileImage()
        );
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!user.isActive()) {
            throw new UnauthorizedException("User account is deactivated. Please contact support.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return new AuthResponse(
                jwt,
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getEmail(),
                userDetails.getRole(),
                user.getProfileImage()
        );
    }

    @Transactional
    public UserDTO verifyCollegeEmail(Long userId, VerifyEmailRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getCode() == null || (!request.getCode().equals("123456") && !request.getCode().equalsIgnoreCase("VERIFIED"))) {
            throw new BadRequestException("Invalid verification OTP code. Use 123456 to verify.");
        }

        if (request.getCollegeId() != null) {
            College college = collegeRepository.findById(request.getCollegeId()).orElse(null);
            user.setCollege(college);
        }
        if (request.getCampusId() != null) {
            Campus campus = campusRepository.findById(request.getCampusId()).orElse(null);
            user.setCampus(campus);
        }
        if (request.getCollegeEmail() != null) {
            user.setCollegeEmail(request.getCollegeEmail());
        }
        if (request.getCourse() != null) {
            user.setCourse(request.getCourse());
        }
        if (request.getGraduationYear() != null) {
            user.setGraduationYear(request.getGraduationYear());
        }

        user.setVerifiedStudent(true);
        User saved = userRepository.save(user);
        return dtoMapper.toUserDTO(saved);
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new UnauthorizedException("User is not authenticated");
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public UserDTO getCurrentUserDTO() {
        return dtoMapper.toUserDTO(getCurrentUser());
    }
}
