package com.example.backend.domain.dtos;

import com.example.backend.domain.entities.User;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class LoginResponseDTOTest {

    @Test
    public void testConstructorAndGetters() {
        User user = new User(UUID.randomUUID(), "johndoe", "John", "john@example.com", "http://img.png", true);
        String accessToken = "access-token-123";
        String refreshToken = "refresh-token-456";

        LoginResponseDTO dto = new LoginResponseDTO(user, accessToken, refreshToken);

        assertEquals(user, dto.getUser());
        assertEquals(accessToken, dto.getAccessToken());
        assertEquals(refreshToken, dto.getRefreshToken());
    }

    @Test
    public void testSetters() {
        LoginResponseDTO dto = new LoginResponseDTO(null, null, null);

        User user = new User(UUID.randomUUID(), "janedoe", "Jane", "jane@example.com", null, false);
        String newAccessToken = "new-access-token";
        String newRefreshToken = "new-refresh-token";

        dto.setUser(user);
        dto.setAccessToken(newAccessToken);
        dto.setRefreshToken(newRefreshToken);

        assertEquals(user, dto.getUser());
        assertEquals(newAccessToken, dto.getAccessToken());
        assertEquals(newRefreshToken, dto.getRefreshToken());
    }
}
