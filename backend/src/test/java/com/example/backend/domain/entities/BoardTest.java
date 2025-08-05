package com.example.backend.domain.entities;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;


public class BoardTest {
    private Board board;
    private UUID boardId;
    private final String title = "Project Board";
    private final String content = "{\"columns\":[{\"id\":1,\"title\":\"To Do\"}]}";
    private final String previewUrl = "http://example.com/preview.png";
    private final Instant now = Instant.now();

    private Team team;

    @BeforeEach
    public void setup() {
        boardId = UUID.randomUUID();
        team = new Team();

        board = new Board();
        board.setId(boardId);
        board.setTitle(title);
        board.setContent(content);
        board.setPreviewUrl(previewUrl);
        board.setTeam(team);
        board.setUpdatedAt(now);
    }

    @Test
    public void testSettersAndGetters() {
        assertEquals(boardId, board.getId());
        assertEquals(title, board.getTitle());
        assertEquals(content, board.getContent());
        assertEquals(previewUrl, board.getPreviewUrl());
        assertEquals(team, board.getTeam());
        assertEquals(now, board.getUpdatedAt());
    }

    @Test
    public void testCreatedAtIsInitiallyNull() {
        assertNull(board.getCreatedAt(), "createdAt should be null until persisted");
    }

    @Test
    public void testUpdatedAtCanBeSet() {
        Instant updateTime = Instant.now();
        board.setUpdatedAt(updateTime);
        assertEquals(updateTime, board.getUpdatedAt());
    }

    @Test
    public void testContentJsonField() {
        String json = "{\"columns\":[{\"id\":2,\"title\":\"In Progress\"}]}";
        board.setContent(json);
        assertEquals(json, board.getContent());
    }

    @Test
    public void testTeamAssociation() {
        Team newTeam = new Team();
        board.setTeam(newTeam);
        assertEquals(newTeam, board.getTeam());
    }

    @Test
    public void testNoArgsConstructor() {
        Board newBoard = new Board();
        assertNull(newBoard.getId());
        assertNull(newBoard.getTitle());
        assertNull(newBoard.getContent());
        assertNull(newBoard.getPreviewUrl());
        assertNull(newBoard.getCreatedAt());
        assertNull(newBoard.getUpdatedAt());
        assertNull(newBoard.getTeam());
    }
}
