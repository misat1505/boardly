package com.example.backend.domain.dtos;

import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class UpdateBoardDTOTest {
    @Test
    public void testDefaultValuesAreEmpty() {
        UpdateBoardDTO dto = new UpdateBoardDTO();

        assertNotNull(dto.getTitle());
        assertNotNull(dto.getContent());
        assertNotNull(dto.getPreviewUrl());

        assertTrue(dto.getTitle().isEmpty());
        assertTrue(dto.getContent().isEmpty());
        assertTrue(dto.getPreviewUrl().isEmpty());
    }

    @Test
    public void testSetAndGetTitle() {
        UpdateBoardDTO dto = new UpdateBoardDTO();
        dto.setTitle(Optional.of("New Title"));

        assertTrue(dto.getTitle().isPresent());
        assertEquals("New Title", dto.getTitle().get());
    }

    @Test
    public void testSetAndGetContent() {
        UpdateBoardDTO dto = new UpdateBoardDTO();
        dto.setContent(Optional.of("{\"columns\": []}"));

        assertTrue(dto.getContent().isPresent());
        assertEquals("{\"columns\": []}", dto.getContent().get());
    }

    @Test
    public void testSetAndGetPreviewUrl() {
        UpdateBoardDTO dto = new UpdateBoardDTO();
        dto.setPreviewUrl(Optional.of("http://example.com/image.png"));

        assertTrue(dto.getPreviewUrl().isPresent());
        assertEquals("http://example.com/image.png", dto.getPreviewUrl().get());
    }

    @Test
    public void testSettingEmptyOptionals() {
        UpdateBoardDTO dto = new UpdateBoardDTO();

        dto.setTitle(Optional.empty());
        dto.setContent(Optional.empty());
        dto.setPreviewUrl(Optional.empty());

        assertTrue(dto.getTitle().isEmpty());
        assertTrue(dto.getContent().isEmpty());
        assertTrue(dto.getPreviewUrl().isEmpty());
    }
}
