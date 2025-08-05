package com.example.backend.application.services;

import com.example.backend.domain.dtos.CreateBoardDTO;
import com.example.backend.domain.dtos.UpdateBoardDTO;
import com.example.backend.domain.entities.Board;
import com.example.backend.domain.entities.Team;
import com.example.backend.domain.entities.User;
import com.example.backend.exceptions.boards.BoardNotFoundException;
import com.example.backend.exceptions.boards.TooManyBoardsException;
import com.example.backend.exceptions.teams.TeamNotFoundException;
import com.example.backend.exceptions.users.UnauthorizedException;
import com.example.backend.exceptions.users.UserNotFoundException;
import com.example.backend.infrastructure.BoardRepository;
import com.example.backend.infrastructure.TeamRepository;
import com.example.backend.infrastructure.UserRepository;
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
    private final UserRepository userRepository;
    private final int maxNonPremiumBoards;

    public BoardService(BoardRepository boardRepository, TeamRepository teamRepository,
                        UserRepository userRepository, @Value("${MAX_NON_PREMIUM_BOARDS}")
                        int maxNonPremiumBoards) {
        this.boardRepository = boardRepository;
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
        this.maxNonPremiumBoards = maxNonPremiumBoards;
    }

    public Set<Board> getTeamBoards(UUID teamId, UUID userId) throws UserNotFoundException,
            TeamNotFoundException, UnauthorizedException {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);

        if (!team.getMembers().contains(user)) throw new UnauthorizedException();

        return boardRepository.findByTeamId(teamId);
    }

    public Board createBoard(CreateBoardDTO dto, UUID userId)
            throws TooManyBoardsException, TeamNotFoundException, UserNotFoundException, UnauthorizedException {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        Team team = teamRepository.findById(dto.getTeamId())
                .orElseThrow(TeamNotFoundException::new);

        if (!team.getMembers().contains(user)) throw new UnauthorizedException();

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

    public Optional<Board> getBoardById(UUID boardId, UUID userId) throws UserNotFoundException,
            UnauthorizedException {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);

        Board board = boardRepository.findById(boardId).orElse(null);
        if (board == null) return Optional.empty();

        if (!board.getTeam().getMembers().contains(user)) throw new UnauthorizedException();

        return Optional.of(board);
    }

    public Board updateBoard(UUID boardId, UpdateBoardDTO updateBoardDTO, UUID userId)
            throws BoardNotFoundException, UserNotFoundException, UnauthorizedException {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        Board board = boardRepository.findById(boardId)
                .orElseThrow(BoardNotFoundException::new);

        if (!board.getTeam().getMembers().contains(user)) throw new UnauthorizedException();

        updateBoardDTO.getTitle().ifPresent(board::setTitle);
        updateBoardDTO.getContent().ifPresent(board::setContent);
        updateBoardDTO.getPreviewUrl().ifPresent(board::setPreviewUrl);
        board.setUpdatedAt(Instant.now());

        return boardRepository.save(board);
    }
}
