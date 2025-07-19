package com.example.backend.controllers;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.application.services.BoardService;
import com.example.backend.application.services.TeamService;
import com.example.backend.domain.dtos.CreateBoardDTO;
import com.example.backend.domain.dtos.UpdateBoardDTO;
import com.example.backend.domain.dtos.CreateTeamDTO;
import com.example.backend.domain.entities.Board;
import com.example.backend.domain.entities.Team;
import com.example.backend.domain.entities.User;



@RestController
@RequestMapping("/teams")
public class TeamController {
  private final TeamService teamService;
  private final BoardService boardService;

    public TeamController(TeamService teamService, BoardService boardService) {
        this.teamService = teamService;
        this.boardService = boardService;
    }

  @GetMapping
  public ResponseEntity<Set<Team>> getUserTeams() {
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    if (!(principal instanceof User user)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Set<Team> teams = teamService.getUserTeams(user.getId());
    return ResponseEntity.ok(teams);
  }
  
  @PostMapping
  public ResponseEntity<Team> createTeam(@RequestBody CreateTeamDTO createTeamDTO) {
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    if (!(principal instanceof User user)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Team team = teamService.createTeam(createTeamDTO, user);
    return ResponseEntity.ok(team);
  }
  
  @GetMapping("/{teamId}/boards")
  public ResponseEntity<Set<Board>> getTeamBoards(@PathVariable UUID teamId) {
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    if (!(principal instanceof User)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Set<Board> boards = boardService.getTeamBoards(teamId);
    return ResponseEntity.ok(boards);
  }

  @GetMapping("/boards/{boardId}")
  public ResponseEntity<Board> getBoardById(@PathVariable UUID boardId) {
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    if (!(principal instanceof User)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Optional<Board> board = boardService.getBoardById(boardId);

    if (board.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(board.get());
  }

  @PutMapping("/boards/{boardId}")
  public ResponseEntity<Board> updateBoard(@PathVariable UUID boardId, @RequestBody UpdateBoardDTO updateBoardDTO) {
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    if (!(principal instanceof User)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Board board = boardService.updateBoard(boardId, updateBoardDTO);

    return ResponseEntity.ok(board);
  }

  @PostMapping("/{teamId}/boards")
  public ResponseEntity<Board> createBoard(@PathVariable UUID teamId, @RequestBody CreateBoardDTO dto) {
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    if (!(principal instanceof User)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    dto.setTeamId(teamId);
    Board board = boardService.createBoard(dto);
    return ResponseEntity.status(HttpStatus.CREATED).body(board);
  }
}
