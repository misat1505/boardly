package com.example.backend.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.application.services.AuthService;
import com.example.backend.domain.entities.User;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.backend.application.services.JwtService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return authService.getAllUsers();
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authorizationHeader.substring(7);
        if (!jwtService.validateAccessToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            String userId = jwtService.extractUsernameFromAccessToken(token);
            Optional<User> user = authService.findById(userId);

            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            return ResponseEntity.ok(user.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
