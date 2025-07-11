package com.example.backend.controllers;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.application.services.AuthService;
import com.example.backend.domain.entities.User;

@RestController
public class LoginController {
  private final AuthService authService;

    public LoginController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/oauth2/login/success")
    public User loginSuccess(@AuthenticationPrincipal OAuth2User principal) {
      return this.authService.login(principal);
    }
}
