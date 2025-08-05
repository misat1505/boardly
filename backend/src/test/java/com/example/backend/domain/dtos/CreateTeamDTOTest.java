package com.example.backend.domain.dtos;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

public class CreateTeamDTOTest {

    @Test
    public void testDefaultValueIsNull() {
        CreateTeamDTO dto = new CreateTeamDTO();
        assertNull(dto.getName(), "name should be null by default");
    }

    @Test
    public void testSetAndGetName() {
        CreateTeamDTO dto = new CreateTeamDTO();
        String teamName = "Engineering";

        dto.setName(teamName);

        assertEquals(teamName, dto.getName());
    }
}
