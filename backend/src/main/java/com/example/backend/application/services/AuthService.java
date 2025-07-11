package com.example.backend.application.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.domain.entities.User;
import com.example.backend.infrastructure.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
