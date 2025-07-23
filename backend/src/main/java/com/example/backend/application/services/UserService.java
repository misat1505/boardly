package com.example.backend.application.services;

import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.domain.entities.User;
import com.example.backend.infrastructure.UserRepository;

@Service
public class UserService {
  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public List<User> searchByPartialUsername(String searchString) {
    if (searchString.isEmpty()) return Collections.emptyList();
    return userRepository.findByUsernameContainingIgnoreCase(searchString);
  }
}
