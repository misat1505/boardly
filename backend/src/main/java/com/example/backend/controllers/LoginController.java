package com.example.backend.controllers;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.backend.application.services.AuthService;
import com.example.backend.domain.dtos.LoginResponseDTO;

@RestController
public class LoginController {
    private final AuthService authService;

    public LoginController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/oauth2/login/success")
    public RedirectView loginSuccess(@AuthenticationPrincipal OAuth2User principal) {
        LoginResponseDTO loginResponse = this.authService.login(principal);

        String redirectUrl = UriComponentsBuilder
                .fromUriString("http://localhost:3000/login/callback")
                .queryParam("accessToken", loginResponse.getAccessToken())
                .queryParam("refreshToken", loginResponse.getRefreshToken())
                .build()
                .toUriString();

        return new RedirectView(redirectUrl);
    }
}
