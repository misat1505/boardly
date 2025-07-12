package com.example.backend.application.services;

import java.util.List;

import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.example.backend.domain.entities.User;
import com.example.backend.infrastructure.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public User login(OAuth2User principal) {
        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");
        String imageUrl = principal.getAttribute("picture");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setUsername(name);
                    newUser.setImageUrl(imageUrl);
                    return userRepository.save(newUser);
                });
        
        String accessToken = jwtService.generateAccessToken(user.getId().toString());
        String refreshToken = jwtService.generateRefreshToken(user.getId().toString());

        return user;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
