package com.example.backend.application.services;

import com.example.backend.domain.entities.User;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.*;

class JwtAuthFilterTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthService authService;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private JwtAuthFilter jwtAuthFilter;

    private final MockHttpServletRequest request = new MockHttpServletRequest();
    private final MockHttpServletResponse response = new MockHttpServletResponse();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldSkipFilterWhenNoAuthorizationHeader() throws Exception {
        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verifyNoInteractions(jwtService, authService);
    }

    @Test
    void shouldSkipFilterWhenAuthorizationHeaderIsInvalid() throws Exception {
        request.addHeader("Authorization", "InvalidTokenHere");

        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verifyNoInteractions(jwtService, authService);
    }

    @Test
    void shouldSkipFilterWhenTokenIsInvalid() throws Exception {
        request.addHeader("Authorization", "Bearer invalid.token.here");

        when(jwtService.validateAccessToken("invalid.token.here")).thenReturn(false);

        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        verify(jwtService).validateAccessToken("invalid.token.here");
        verify(filterChain).doFilter(request, response);
        verifyNoMoreInteractions(jwtService, authService);
    }

    @Test
    void shouldSkipFilterWhenUserNotFound() throws Exception {
        request.addHeader("Authorization", "Bearer valid.token");

        when(jwtService.validateAccessToken("valid.token")).thenReturn(true);
        when(jwtService.extractUsernameFromAccessToken("valid.token")).thenReturn("user-id");
        when(authService.findById("user-id")).thenReturn(Optional.empty());

        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verify(jwtService).validateAccessToken("valid.token");
        verify(jwtService).extractUsernameFromAccessToken("valid.token");
        verify(authService).findById("user-id");
    }

    @Test
    void shouldSetAuthenticationWhenTokenAndUserAreValid() throws Exception {
        request.addHeader("Authorization", "Bearer valid.token");
        User user = new User();
        UUID userId = UUID.randomUUID();
        user.setId(userId);

        when(jwtService.validateAccessToken("valid.token")).thenReturn(true);
        when(jwtService.extractUsernameFromAccessToken("valid.token")).thenReturn(userId.toString());
        when(authService.findById(userId.toString())).thenReturn(Optional.of(user));

        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        verify(jwtService).validateAccessToken("valid.token");
        verify(jwtService).extractUsernameFromAccessToken("valid.token");
        verify(authService).findById(userId.toString());
        verify(filterChain).doFilter(request, response);

        // Assert that the user is now authenticated
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;
        assert authentication.getPrincipal() == user;
    }
}

