package com.ecomarket.controller;

import com.ecomarket.dto.ChangePasswordRequest;
import com.ecomarket.dto.UpdateProfileRequest;
import com.ecomarket.dto.UserDTO;
import com.ecomarket.service.AuthService;
import com.ecomarket.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getProfile() {
        return ResponseEntity.ok(authService.getCurrentUserDTO());
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        UserDTO updated = userService.updateProfile(request);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/me/password")
    public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password changed successfully");
        return ResponseEntity.ok(response);
    }
}
