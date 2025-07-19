package com.example.backend.application.services;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.backend.domain.dtos.CreateBoardDTO;
import com.example.backend.domain.dtos.UpdateBoardDTO;
import com.example.backend.domain.entities.Board;
import com.example.backend.domain.entities.Team;
import com.example.backend.infrastructure.BoardRepository;
import com.example.backend.infrastructure.TeamRepository;

@Service
public class BoardService {
  private final BoardRepository boardRepository;
  private final TeamRepository teamRepository;
  
  public BoardService(BoardRepository boardRepository, TeamRepository teamRepository) {
    this.boardRepository = boardRepository;
    this.teamRepository = teamRepository;
  }

  public Set<Board> getTeamBoards(UUID teamId) {
    return boardRepository.findByTeamId(teamId);
  }
  
  public Board createBoard(CreateBoardDTO dto) {
    Optional<Team> teamOpt = teamRepository.findById(dto.getTeamId());
    if (teamOpt.isEmpty()) {
      throw new IllegalArgumentException("Team not found");
    }

    Board board = new Board();
    board.setTitle(dto.getTitle());
    board.setContent(dto.getContent());
    board.setTeam(teamOpt.get());

    return boardRepository.save(board);
  }
  
  public Optional<Board> getBoardById(UUID boardId) {
    return boardRepository.findById(boardId);
  }

  public Board updateBoard(UUID boardId, UpdateBoardDTO updateBoardDTO) {
    Board board = boardRepository.findById(boardId)
        .orElseThrow(() -> new RuntimeException("Board not found"));

    board.setTitle(updateBoardDTO.getTitle());
    board.setContent(updateBoardDTO.getContent());

    return boardRepository.save(board);
  }
}
