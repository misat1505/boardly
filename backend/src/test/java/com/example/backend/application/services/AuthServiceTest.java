package com.example.backend.application.services;

import com.example.backend.domain.dtos.LoginResponseDTO;
import com.example.backend.domain.entities.User;
import com.example.backend.exceptions.auth.InvalidTokenException;
import com.example.backend.exceptions.users.UserNotFoundException;
import com.example.backend.infrastructure.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    private UserRepository userRepository;
    private JwtService jwtService;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        jwtService = mock(JwtService.class);
        authService = new AuthService(userRepository, jwtService);
    }

    @Test
    void login_existingUser_returnsLoginResponse() {
        OAuth2User principal = mock(OAuth2User.class);
        when(principal.getAttribute("email")).thenReturn("user@example.com");
        when(principal.getAttribute("given_name")).thenReturn("John");
        when(principal.getAttribute("name")).thenReturn("johnny");
        when(principal.getAttribute("picture")).thenReturn("url");

        User existingUser = new User();
        existingUser.setId(UUID.randomUUID());
        existingUser.setEmail("user@example.com");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(existingUser));
        when(jwtService.generateAccessToken(existingUser.getId().toString())).thenReturn("access-token");
        when(jwtService.generateRefreshToken(existingUser.getId().toString())).thenReturn("refresh-token");

        LoginResponseDTO response = authService.login(principal);

        assertEquals(existingUser, response.getUser());
        assertEquals("access-token", response.getAccessToken());
        assertEquals("refresh-token", response.getRefreshToken());

        verify(userRepository, never()).save(any());
    }

    @Test
    void login_newUser_createsUserAndReturnsLoginResponse() {
        OAuth2User principal = mock(OAuth2User.class);
        when(principal.getAttribute("email")).thenReturn("new@example.com");
        when(principal.getAttribute("given_name")).thenReturn("Jane");
        when(principal.getAttribute("name")).thenReturn("jane_doe");
        when(principal.getAttribute("picture")).thenReturn("image_url");

        when(userRepository.findByEmail("new@example.com")).thenReturn(Optional.empty());

        User savedUser = new User();
        savedUser.setId(UUID.randomUUID());
        savedUser.setEmail("new@example.com");
        savedUser.setGivenName("Jane");
        savedUser.setUsername("jane_doe");
        savedUser.setImageUrl("image_url");

        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateAccessToken(savedUser.getId().toString())).thenReturn("access-token");
        when(jwtService.generateRefreshToken(savedUser.getId().toString())).thenReturn("refresh-token");

        LoginResponseDTO response = authService.login(principal);

        assertEquals(savedUser, response.getUser());
        assertEquals("access-token", response.getAccessToken());
        assertEquals("refresh-token", response.getRefreshToken());

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        User createdUser = captor.getValue();

        assertEquals("new@example.com", createdUser.getEmail());
        assertEquals("Jane", createdUser.getGivenName());
        assertEquals("jane_doe", createdUser.getUsername());
        assertEquals("image_url", createdUser.getImageUrl());
    }

    @Test
    void findById_existingUser_returnsUser() {
        UUID id = UUID.randomUUID();
        User user = new User();
        user.setId(id);

        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        Optional<User> foundUser = authService.findById(id.toString());

        assertTrue(foundUser.isPresent());
        assertEquals(user, foundUser.get());
    }

    @Test
    void findById_invalidUUID_throwsException() {
        assertThrows(IllegalArgumentException.class, () -> authService.findById("invalid-uuid"));
    }

    @Test
    void generateAccessToken_validRefreshToken_returnsAccessToken()
            throws UserNotFoundException, InvalidTokenException {
        String userId = UUID.randomUUID().toString();
        String refreshToken = "valid-refresh-token";

        when(jwtService.validateRefreshToken(refreshToken)).thenReturn(true);
        when(jwtService.extractUsernameFromRefreshToken(refreshToken)).thenReturn(userId);
        when(userRepository.findById(UUID.fromString(userId))).thenReturn(Optional.of(new User()));
        when(jwtService.generateAccessToken(userId)).thenReturn("new-access-token");

        String accessToken = authService.generateAccessToken(refreshToken);

        assertEquals("new-access-token", accessToken);
    }

    @Test
    void generateAccessToken_invalidRefreshToken_throwsInvalidTokenException() {
        String refreshToken = "invalid-token";

        when(jwtService.validateRefreshToken(refreshToken)).thenReturn(false);

        assertThrows(InvalidTokenException.class, () -> authService.generateAccessToken(refreshToken));
    }

    @Test
    void generateAccessToken_userNotFound_throwsUserNotFoundException() {
        String userId = UUID.randomUUID().toString();
        String refreshToken = "valid-token";

        when(jwtService.validateRefreshToken(refreshToken)).thenReturn(true);
        when(jwtService.extractUsernameFromRefreshToken(refreshToken)).thenReturn(userId);
        when(userRepository.findById(UUID.fromString(userId))).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> authService.generateAccessToken(refreshToken));
    }
}
