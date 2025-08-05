package com.example.backend.domain.dtos;

import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

public class CreateBoardDTOTest {

    @Test
    public void testDefaultValuesAreNull() {
        CreateBoardDTO dto = new CreateBoardDTO();

        assertNull(dto.getTitle(), "title should be null by default");
        assertNull(dto.getContent(), "content should be null by default");
        assertNull(dto.getTeamId(), "teamId should be null by default");
    }

    @Test
    public void testSetAndGetTitle() {
        CreateBoardDTO dto = new CreateBoardDTO();
        String title = "Sprint Planning";

        dto.setTitle(title);

        assertEquals(title, dto.getTitle());
    }

    @Test
    public void testSetAndGetContent() {
        CreateBoardDTO dto = new CreateBoardDTO();
        String content = "{\"columns\":[{\"title\":\"To Do\"}]}";

        dto.setContent(content);

        assertEquals(content, dto.getContent());
    }

    @Test
    public void testSetAndGetTeamId() {
        CreateBoardDTO dto = new CreateBoardDTO();
        UUID teamId = UUID.randomUUID();

        dto.setTeamId(teamId);

        assertEquals(teamId, dto.getTeamId());
    }
}
