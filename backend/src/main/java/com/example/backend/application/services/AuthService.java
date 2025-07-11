package com.example.backend.application.services;

import java.util.List;

import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.example.backend.domain.entities.User;
import com.example.backend.infrastructure.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
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

        return user;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
