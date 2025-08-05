package com.example.backend.domain.dtos;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

public class RefreshTokenDTOTest {

    @Test
    public void testDefaultValueIsNull() {
        RefreshTokenDTO dto = new RefreshTokenDTO();
        assertNull(dto.getRefreshToken(), "refreshToken should be null by default");
    }

    @Test
    public void testSetAndGetRefreshToken() {
        RefreshTokenDTO dto = new RefreshTokenDTO();
        String token = "test-refresh-token";

        dto.setRefreshToken(token);

        assertEquals(token, dto.getRefreshToken());
    }
}
