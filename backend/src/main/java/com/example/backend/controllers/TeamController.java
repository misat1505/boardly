package com.example.backend.controllers;

import com.example.backend.application.services.BoardService;
import com.example.backend.application.services.TeamService;
import com.example.backend.domain.dtos.CreateBoardDTO;
import com.example.backend.domain.dtos.CreateTeamDTO;
import com.example.backend.domain.dtos.InviteUserToTeamDTO;
import com.example.backend.domain.dtos.UpdateBoardDTO;
import com.example.backend.domain.entities.Board;
import com.example.backend.domain.entities.Team;
import com.example.backend.domain.entities.User;
import com.example.backend.exceptions.teams.TeamCreationException;
import com.example.backend.exceptions.users.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;


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
    public ResponseEntity<Set<Team>> getUserTeams(@AuthenticationPrincipal User user) {
        Set<Team> teams = teamService.getUserTeams(user.getId());
        return ResponseEntity.ok(teams);
    }

    @PostMapping
    public ResponseEntity<?> createTeam(@RequestBody CreateTeamDTO createTeamDTO, @AuthenticationPrincipal User user) {
        try {
            Team team = teamService.createTeam(createTeamDTO, user);
            return ResponseEntity.ok(team);
        } catch (TeamCreationException | UserNotFoundException e) {
            return ResponseEntity.status(e.getStatus()).body(e.getMessage());
        }
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
    public ResponseEntity<Board> updateBoard(@PathVariable UUID boardId, @RequestBody UpdateBoardDTO updateBoardDTO) {
        Board board = boardService.updateBoard(boardId, updateBoardDTO);
        return ResponseEntity.ok(board);
    }

    @PostMapping("/{teamId}/boards")
    public ResponseEntity<?> createBoard(@PathVariable UUID teamId, @RequestBody CreateBoardDTO dto) {
        try {
            dto.setTeamId(teamId);
            Board board = boardService.createBoard(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(board);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/{teamId}/invite")
    public ResponseEntity<String> inviteUserToTeam(@PathVariable UUID teamId, @RequestBody InviteUserToTeamDTO dto) {
        try {
            teamService.inviteUserToTeam(teamId, dto);
            return ResponseEntity.status(HttpStatus.CREATED).body("User invited");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
