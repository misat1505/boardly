package com.example.backend.application.services;

import com.example.backend.domain.dtos.LoginResponseDTO;
import com.example.backend.domain.entities.User;
import com.example.backend.infrastructure.UserRepository;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public LoginResponseDTO login(OAuth2User principal) {
        String email = principal.getAttribute("email");
        String givenName = principal.getAttribute("given_name");
        String name = principal.getAttribute("name");
        String imageUrl = principal.getAttribute("picture");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setGivenName(givenName);
                    newUser.setUsername(name);
                    newUser.setImageUrl(imageUrl);
                    return userRepository.save(newUser);
                });

        String accessToken = jwtService.generateAccessToken(user.getId().toString());
        String refreshToken = jwtService.generateRefreshToken(user.getId().toString());

        return new LoginResponseDTO(user, accessToken, refreshToken);
    }

    public Optional<User> findById(String id) {
        UUID uuid = UUID.fromString(id);
        return userRepository.findById(uuid);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public String generateAccessToken(String refreshToken) {
        boolean isTokenValid = jwtService.validateRefreshToken(refreshToken);
        if (!isTokenValid) throw new RuntimeException("Invalid refresh token");

        String userId = jwtService.extractUsernameFromRefreshToken(refreshToken);
        userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        return jwtService.generateAccessToken(userId);
    }
}
