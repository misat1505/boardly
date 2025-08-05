package com.example.backend.controllers;

import com.example.backend.application.services.AuthService;
import com.example.backend.domain.dtos.RefreshTokenDTO;
import com.example.backend.domain.entities.User;
import com.example.backend.exceptions.auth.InvalidTokenException;
import com.example.backend.exceptions.users.UserNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class AuthControllerTest {

    private AuthController authController;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = mock(AuthService.class);
        authController = new AuthController(authService);
    }

    @Test
    void getCurrentUser_ReturnsUser() {
        User mockUser = new User();
        mockUser.setId(UUID.randomUUID());
        mockUser.setUsername("testuser");

        ResponseEntity<User> response = authController.getCurrentUser(mockUser);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(mockUser, response.getBody());
    }

    @Test
    void generateAccessToken_ValidToken_ReturnsAccessToken() throws Exception {
        String refreshToken = "validRefreshToken";
        String expectedAccessToken = "newAccessToken";

        when(authService.generateAccessToken(refreshToken)).thenReturn(expectedAccessToken);

        RefreshTokenDTO dto = new RefreshTokenDTO();
        dto.setRefreshToken(refreshToken);

        ResponseEntity<String> response = authController.generateAccessToken(dto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(expectedAccessToken, response.getBody());
    }

    @Test
    void generateAccessToken_InvalidToken_ThrowsInvalidTokenException() throws Exception {
        String invalidRefreshToken = "invalidToken";
        RefreshTokenDTO dto = new RefreshTokenDTO();
        dto.setRefreshToken(invalidRefreshToken);

        when(authService.generateAccessToken(invalidRefreshToken))
                .thenThrow(new InvalidTokenException("Invalid token"));

        assertThrows(InvalidTokenException.class, () -> {
            authController.generateAccessToken(dto);
        });
    }

    @Test
    void generateAccessToken_UserNotFound_ThrowsUserNotFoundException() throws Exception {
        String refreshToken = "tokenForMissingUser";
        RefreshTokenDTO dto = new RefreshTokenDTO();
        dto.setRefreshToken(refreshToken);

        when(authService.generateAccessToken(refreshToken))
                .thenThrow(new UserNotFoundException("User not found"));

        assertThrows(UserNotFoundException.class, () -> {
            authController.generateAccessToken(dto);
        });
    }
}

