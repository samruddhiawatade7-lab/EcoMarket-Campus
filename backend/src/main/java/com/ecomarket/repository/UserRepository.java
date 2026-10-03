package com.ecomarket.repository;

import com.ecomarket.entity.Role;
import com.ecomarket.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    
    Page<User> findByRole(Role role, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE (:query IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))) AND (:role IS NULL OR u.role = :role)")
    Page<User> searchUsers(String query, Role role, Pageable pageable);
    
    long countByRole(Role role);
}
