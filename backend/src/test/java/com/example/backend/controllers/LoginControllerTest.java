package com.example.backend.controllers;

import com.example.backend.application.services.AuthService;
import com.example.backend.domain.dtos.LoginResponseDTO;
import com.example.backend.domain.entities.User;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.servlet.view.RedirectView;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

class LoginControllerTest {

    @Test
    void loginSuccess_RedirectsWithTokens() {
        AuthService authService = mock(AuthService.class);
        OAuth2User principal = mock(OAuth2User.class);

        String frontendUrl = "http://localhost:3000";
        LoginController controller = new LoginController(authService, frontendUrl);

        User user = new User();

        LoginResponseDTO loginResponse = new LoginResponseDTO(user, "access-token-123", "refresh-token-456");

        when(authService.login(principal)).thenReturn(loginResponse);

        RedirectView redirectView = controller.loginSuccess(principal);

        assertNotNull(redirectView);
        String expectedUrl = "http://localhost:3000/login/callback?accessToken=access-token-123&refreshToken=refresh-token-456";
        assertEquals(expectedUrl, redirectView.getUrl());

        verify(authService).login(principal);
    }
}
