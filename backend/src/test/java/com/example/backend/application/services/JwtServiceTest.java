package com.example.backend.application.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.*;

public class JwtServiceTest {

    private JwtService jwtService;

    private final String testAccessSecret = "access-access-access-access-access-access-access-123";
    private final String testRefreshSecret = "refresh-refresh-refresh-refresh-refresh-refresh-456";
    private final long accessExp = 1000 * 60 * 60;
    private final long refreshExp = 1000 * 60 * 60 * 24;

    @BeforeEach
    void setUp() throws Exception {
        jwtService = new JwtService();

        setField(jwtService, "accessSecretRaw", testAccessSecret);
        setField(jwtService, "refreshSecretRaw", testRefreshSecret);
        setField(jwtService, "accessTokenExpirationMs", accessExp);
        setField(jwtService, "refreshTokenExpirationMs", refreshExp);

        jwtService.init();
    }

    @Test
    void generateAndValidateAccessToken() {
        String username = "user123";
        String token = jwtService.generateAccessToken(username);

        assertTrue(jwtService.validateAccessToken(token));
        assertEquals(username, jwtService.extractUsernameFromAccessToken(token));
    }

    @Test
    void generateAndValidateRefreshToken() {
        String username = "user456";
        String token = jwtService.generateRefreshToken(username);

        assertTrue(jwtService.validateRefreshToken(token));
        assertEquals(username, jwtService.extractUsernameFromRefreshToken(token));
    }

    @Test
    void invalidAccessTokenReturnsFalse() {
        assertFalse(jwtService.validateAccessToken("invalid.token.value"));
    }

    @Test
    void invalidRefreshTokenReturnsFalse() {
        assertFalse(jwtService.validateRefreshToken("invalid.token.value"));
    }

    private void setField(Object target, String fieldName, Object value) throws Exception {
        Field field = JwtService.class.getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }
}
