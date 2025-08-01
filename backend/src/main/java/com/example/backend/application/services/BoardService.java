package com.example.backend.application.services;

import com.example.backend.domain.dtos.CreateBoardDTO;
import com.example.backend.domain.dtos.UpdateBoardDTO;
import com.example.backend.domain.entities.Board;
import com.example.backend.domain.entities.Team;
import com.example.backend.exceptions.boards.BoardNotFoundException;
import com.example.backend.exceptions.boards.TooManyBoardsException;
import com.example.backend.exceptions.teams.TeamNotFoundException;
import com.example.backend.infrastructure.BoardRepository;
import com.example.backend.infrastructure.TeamRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class BoardService {
    private final BoardRepository boardRepository;
    private final TeamRepository teamRepository;
    @Value("${MAX_NON_PREMIUM_BOARDS}")
    private int maxNonPremiumBoards;

    public BoardService(BoardRepository boardRepository, TeamRepository teamRepository) {
        this.boardRepository = boardRepository;
        this.teamRepository = teamRepository;
    }

    public Set<Board> getTeamBoards(UUID teamId) {
        return boardRepository.findByTeamId(teamId);
    }

    public Board createBoard(CreateBoardDTO dto)
            throws TooManyBoardsException, TeamNotFoundException {
        Team team = teamRepository.findById(dto.getTeamId())
                .orElseThrow(TeamNotFoundException::new);

        if (!team.getIsUpgraded()) {
            Set<Board> teamBoards = boardRepository.findByTeamId(team.getId());
            if (teamBoards.size() >= maxNonPremiumBoards) {
                throw new TooManyBoardsException("Non-premium team can only have " + maxNonPremiumBoards + " boards.");
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

    public Board updateBoard(UUID boardId, UpdateBoardDTO updateBoardDTO)
            throws BoardNotFoundException {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(BoardNotFoundException::new);

        updateBoardDTO.getTitle().ifPresent(board::setTitle);
        updateBoardDTO.getContent().ifPresent(board::setContent);
        updateBoardDTO.getPreviewUrl().ifPresent(board::setPreviewUrl);
        board.setUpdatedAt(Instant.now());

        return boardRepository.save(board);
    }
}
