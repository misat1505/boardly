package com.example.backend.application.services;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.backend.domain.dtos.CreateBoardDTO;
import com.example.backend.domain.dtos.UpdateBoardDTO;
import com.example.backend.domain.entities.Board;
import com.example.backend.domain.entities.Team;
import com.example.backend.infrastructure.BoardRepository;
import com.example.backend.infrastructure.TeamRepository;

@Service
public class BoardService {
  @Value("${team.max-non-premium-boards}")
  private int maxNonPremiumBoards;

  private final BoardRepository boardRepository;
  private final TeamRepository teamRepository;
  
  public BoardService(BoardRepository boardRepository, TeamRepository teamRepository) {
    this.boardRepository = boardRepository;
    this.teamRepository = teamRepository;
  }

  public Set<Board> getTeamBoards(UUID teamId) {
    return boardRepository.findByTeamId(teamId);
  }
  
  public Board createBoard(CreateBoardDTO dto) throws IllegalStateException {
    Team team = teamRepository.findById(dto.getTeamId())
        .orElseThrow(() -> new IllegalArgumentException("Team not found"));
    
    if (!team.getIsUpgraded()) {
      Set<Board> teamBoards = boardRepository.findByTeamId(team.getId());
      if (teamBoards.size() >= maxNonPremiumBoards) {
        throw new IllegalStateException("Non-premium team can only have " + maxNonPremiumBoards + " boards.");
      }
    }

    Board board = new Board();
    board.setTitle(dto.getTitle());
    board.setContent(dto.getContent());
    board.setTeam(team);

    return boardRepository.save(board);
  }
  
  public Optional<Board> getBoardById(UUID boardId) {
    return boardRepository.findById(boardId);
  }

  public Board updateBoard(UUID boardId, UpdateBoardDTO updateBoardDTO) {
    Board board = boardRepository.findById(boardId)
        .orElseThrow(() -> new RuntimeException("Board not found"));

    updateBoardDTO.getTitle().ifPresent(board::setTitle);
    updateBoardDTO.getContent().ifPresent(board::setContent);
    updateBoardDTO.getPreviewUrl().ifPresent(board::setPreviewUrl);
    board.setUpdatedAt(Instant.now());

    return boardRepository.save(board);
  }
}
