package com.example.backend.controllers;

import com.example.backend.application.services.AuthService;
import com.example.backend.domain.dtos.RefreshTokenDTO;
import com.example.backend.domain.entities.User;
import com.example.backend.exceptions.auth.InvalidTokenException;
import com.example.backend.exceptions.users.UserNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(user);
    }

    @PostMapping("/refresh")
    public ResponseEntity<String> generateAccessToken(@RequestBody RefreshTokenDTO dto)
            throws UserNotFoundException, InvalidTokenException {
        String accessToken = authService.generateAccessToken(dto.getRefreshToken());
        return ResponseEntity.ok(accessToken);
    }
}
