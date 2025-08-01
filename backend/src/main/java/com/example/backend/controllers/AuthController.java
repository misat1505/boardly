package com.example.backend.controllers;

import com.example.backend.application.services.AuthService;
import com.example.backend.domain.dtos.RefreshTokenDTO;
import com.example.backend.domain.entities.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return authService.getAllUsers();
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestHeader("Authorization") String authorizationHeader) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof User user) {
            return ResponseEntity.ok(user);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<String> generateAccessToken(@RequestBody RefreshTokenDTO dto) {
        String accessToken = authService.generateAccessToken(dto.getRefreshToken());
        return ResponseEntity.ok(accessToken);
    }
}
