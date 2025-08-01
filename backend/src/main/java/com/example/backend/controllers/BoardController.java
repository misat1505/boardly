package com.example.backend.controllers;

import com.example.backend.application.services.BoardService;
import com.example.backend.domain.dtos.CreateBoardDTO;
import com.example.backend.domain.dtos.UpdateBoardDTO;
import com.example.backend.domain.entities.Board;
import com.example.backend.exceptions.boards.BoardNotFoundException;
import com.example.backend.exceptions.boards.TooManyBoardsException;
import com.example.backend.exceptions.teams.TeamNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/teams")
public class BoardController {
    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping("/{teamId}/boards")
    public ResponseEntity<Set<Board>> getTeamBoards(@PathVariable UUID teamId) {
        Set<Board> boards = boardService.getTeamBoards(teamId);
        return ResponseEntity.ok(boards);
    }

    @GetMapping("/boards/{boardId}")
    public ResponseEntity<Board> getBoardById(@PathVariable UUID boardId) {
        Optional<Board> board = boardService.getBoardById(boardId);
        return board.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());

    }

    @PutMapping("/boards/{boardId}")
    public ResponseEntity<Board> updateBoard(@PathVariable UUID boardId,
                                             @RequestBody UpdateBoardDTO updateBoardDTO)
            throws BoardNotFoundException {
        Board board = boardService.updateBoard(boardId, updateBoardDTO);
        return ResponseEntity.ok(board);
    }

    @PostMapping("/{teamId}/boards")
    public ResponseEntity<Board> createBoard(@PathVariable UUID teamId,
                                             @RequestBody CreateBoardDTO dto)
            throws TooManyBoardsException, TeamNotFoundException {
        dto.setTeamId(teamId);
        Board board = boardService.createBoard(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(board);
    }
}
