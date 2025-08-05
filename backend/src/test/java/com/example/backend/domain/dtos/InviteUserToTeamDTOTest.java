package com.example.backend.domain.dtos;

import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

public class InviteUserToTeamDTOTest {

    @Test
    public void testDefaultValueIsNull() {
        InviteUserToTeamDTO dto = new InviteUserToTeamDTO();
        assertNull(dto.getUserId(), "userId should be null by default");
    }

    @Test
    public void testSetAndGetUserId() {
        InviteUserToTeamDTO dto = new InviteUserToTeamDTO();
        UUID userId = UUID.randomUUID();

        dto.setUserId(userId);

        assertEquals(userId, dto.getUserId());
    }
}
