package com.example.backend.controllers;

import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    @GetMapping("/oauth2/login/success")
    public Map<String, Object> loginSuccess(@AuthenticationPrincipal OAuth2User principal) {
        return principal.getAttributes();
    }
}
