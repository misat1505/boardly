package com.example.backend.controllers;

import com.example.backend.application.services.BoardService;
import com.example.backend.domain.dtos.CreateBoardDTO;
import com.example.backend.domain.dtos.UpdateBoardDTO;
import com.example.backend.domain.entities.Board;
import com.example.backend.domain.entities.User;
import com.example.backend.exceptions.boards.TooManyBoardsException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class BoardControllerTest {

    private BoardService boardService;
    private BoardController boardController;
    private User mockUser;

    @BeforeEach
    void setUp() {
        boardService = mock(BoardService.class);
        boardController = new BoardController(boardService);

        mockUser = new User();
        mockUser.setId(UUID.randomUUID());
    }

    @Test
    void getTeamBoards_ReturnsBoards() throws Exception {
        UUID teamId = UUID.randomUUID();
        Set<Board> mockBoards = new HashSet<>();
        mockBoards.add(new Board());
        mockBoards.add(new Board());

        when(boardService.getTeamBoards(teamId, mockUser.getId())).thenReturn(mockBoards);

        ResponseEntity<Set<Board>> response = boardController.getTeamBoards(teamId, mockUser);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockBoards, response.getBody());
    }

    @Test
    void getBoardById_BoardFound_ReturnsBoard() throws Exception {
        UUID boardId = UUID.randomUUID();
        Board board = new Board();

        when(boardService.getBoardById(boardId, mockUser.getId())).thenReturn(Optional.of(board));

        ResponseEntity<Board> response = boardController.getBoardById(boardId, mockUser);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(board, response.getBody());
    }

    @Test
    void getBoardById_BoardNotFound_ReturnsNotFound() throws Exception {
        UUID boardId = UUID.randomUUID();

        when(boardService.getBoardById(boardId, mockUser.getId())).thenReturn(Optional.empty());

        ResponseEntity<Board> response = boardController.getBoardById(boardId, mockUser);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void updateBoard_ReturnsUpdatedBoard() throws Exception {
        UUID boardId = UUID.randomUUID();
        UpdateBoardDTO updateDTO = new UpdateBoardDTO();
        Board updatedBoard = new Board();

        when(boardService.updateBoard(boardId, updateDTO, mockUser.getId())).thenReturn(updatedBoard);

        ResponseEntity<Board> response = boardController.updateBoard(boardId, updateDTO, mockUser);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedBoard, response.getBody());
    }

    @Test
    void createBoard_ReturnsCreatedBoard() throws Exception {
        UUID teamId = UUID.randomUUID();
        CreateBoardDTO createDTO = new CreateBoardDTO();
        Board createdBoard = new Board();

        when(boardService.createBoard(any(CreateBoardDTO.class), eq(mockUser.getId()))).thenReturn(createdBoard);

        ResponseEntity<Board> response = boardController.createBoard(teamId, createDTO, mockUser);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(createdBoard, response.getBody());
        assertEquals(teamId, createDTO.getTeamId());
    }

    @Test
    void createBoard_TooManyBoards_ThrowsTooManyBoardsException() throws Exception {
        UUID teamId = UUID.randomUUID();
        CreateBoardDTO createDTO = new CreateBoardDTO();

        when(boardService.createBoard(any(CreateBoardDTO.class), eq(mockUser.getId())))
                .thenThrow(new TooManyBoardsException("Too many boards"));

        assertThrows(TooManyBoardsException.class, () -> {
            boardController.createBoard(teamId, createDTO, mockUser);
        });
    }
}

