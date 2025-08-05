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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class BoardServiceTest {

    private BoardRepository boardRepository;
    private TeamRepository teamRepository;
    private UserRepository userRepository;

    private BoardService boardService;

    private final int maxNonPremiumBoards = 3;

    @BeforeEach
    void setUp() {
        boardRepository = mock(BoardRepository.class);
        teamRepository = mock(TeamRepository.class);
        userRepository = mock(UserRepository.class);

        boardService = new BoardService(boardRepository, teamRepository, userRepository, maxNonPremiumBoards);
    }

    @Test
    void getTeamBoards_userNotFound_throwsUserNotFoundException() {
        UUID userId = UUID.randomUUID();
        UUID teamId = UUID.randomUUID();

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> boardService.getTeamBoards(teamId, userId));
    }

    @Test
    void getTeamBoards_teamNotFound_throwsTeamNotFoundException() {
        UUID userId = UUID.randomUUID();
        UUID teamId = UUID.randomUUID();

        when(userRepository.findById(userId)).thenReturn(Optional.of(new User()));
        when(teamRepository.findById(teamId)).thenReturn(Optional.empty());

        assertThrows(TeamNotFoundException.class, () -> boardService.getTeamBoards(teamId, userId));
    }

    @Test
    void getTeamBoards_userNotMember_throwsUnauthorizedException() {
        UUID userId = UUID.randomUUID();
        UUID teamId = UUID.randomUUID();

        User user = new User();
        Team team = new Team();
        team.setMembers(Collections.emptySet());

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));

        assertThrows(UnauthorizedException.class, () -> boardService.getTeamBoards(teamId, userId));
    }

    @Test
    void getTeamBoards_returnsBoards() throws Exception {
        UUID userId = UUID.randomUUID();
        UUID teamId = UUID.randomUUID();

        User user = new User();
        Team team = new Team();
        team.setMembers(Set.of(user));

        Board board1 = new Board();
        Board board2 = new Board();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));
        when(boardRepository.findByTeamId(teamId)).thenReturn(Set.of(board1, board2));

        Set<Board> boards = boardService.getTeamBoards(teamId, userId);

        assertEquals(2, boards.size());
        assertTrue(boards.contains(board1));
        assertTrue(boards.contains(board2));
    }

    @Test
    void createBoard_nonPremiumTeamTooManyBoards_throwsTooManyBoardsException() {
        UUID userId = UUID.randomUUID();
        UUID teamId = UUID.randomUUID();

        User user = new User();
        Team team = new Team();
        team.setId(teamId);
        team.setMembers(Set.of(user));
        team.setIsUpgraded(false);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));

        Set<Board> boards = new HashSet<>();
        for (int i = 0; i < maxNonPremiumBoards; i++) {
            boards.add(new Board());
        }
        when(boardRepository.findByTeamId(teamId)).thenReturn(boards);

        CreateBoardDTO dto = new CreateBoardDTO();
        dto.setTeamId(teamId);
        dto.setTitle("Title");
        dto.setContent("Content");

        assertThrows(TooManyBoardsException.class, () -> boardService.createBoard(dto, userId));
    }

    @Test
    void createBoard_validInput_savesAndReturnsBoard() throws Exception {
        UUID userId = UUID.randomUUID();
        UUID teamId = UUID.randomUUID();

        User user = new User();
        Team team = new Team();
        team.setMembers(Set.of(user));
        team.setIsUpgraded(true); // Premium team so no limit

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));
        when(boardRepository.save(any(Board.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CreateBoardDTO dto = new CreateBoardDTO();
        dto.setTeamId(teamId);
        dto.setTitle("Board title");
        dto.setContent("Board content");

        Board created = boardService.createBoard(dto, userId);

        assertEquals("Board title", created.getTitle());
        assertEquals("Board content", created.getContent());
        assertEquals(team, created.getTeam());

        verify(boardRepository).save(created);
    }

    @Test
    void getBoardById_boardNotFound_returnsEmpty() throws Exception {
        UUID userId = UUID.randomUUID();
        UUID boardId = UUID.randomUUID();

        when(userRepository.findById(userId)).thenReturn(Optional.of(new User()));
        when(boardRepository.findById(boardId)).thenReturn(Optional.empty());

        Optional<Board> boardOpt = boardService.getBoardById(boardId, userId);

        assertTrue(boardOpt.isEmpty());
    }

    @Test
    void getBoardById_userNotMember_throwsUnauthorizedException() {
        UUID userId = UUID.randomUUID();
        UUID boardId = UUID.randomUUID();

        User user = new User();
        Team team = new Team();
        team.setMembers(Collections.emptySet());

        Board board = new Board();
        board.setTeam(team);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(boardRepository.findById(boardId)).thenReturn(Optional.of(board));

        assertThrows(UnauthorizedException.class, () -> boardService.getBoardById(boardId, userId));
    }

    @Test
    void getBoardById_userMember_returnsBoard() throws Exception {
        UUID userId = UUID.randomUUID();
        UUID boardId = UUID.randomUUID();

        User user = new User();
        Team team = new Team();
        team.setMembers(Set.of(user));

        Board board = new Board();
        board.setTeam(team);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(boardRepository.findById(boardId)).thenReturn(Optional.of(board));

        Optional<Board> result = boardService.getBoardById(boardId, userId);

        assertTrue(result.isPresent());
        assertEquals(board, result.get());
    }

    @Test
    void updateBoard_boardNotFound_throwsBoardNotFoundException() {
        UUID userId = UUID.randomUUID();
        UUID boardId = UUID.randomUUID();

        when(userRepository.findById(userId)).thenReturn(Optional.of(new User()));
        when(boardRepository.findById(boardId)).thenReturn(Optional.empty());

        assertThrows(BoardNotFoundException.class,
                () -> boardService.updateBoard(boardId, new UpdateBoardDTO(), userId));
    }

    @Test
    void updateBoard_userNotMember_throwsUnauthorizedException() {
        UUID userId = UUID.randomUUID();
        UUID boardId = UUID.randomUUID();

        User user = new User();
        Team team = new Team();
        team.setMembers(Collections.emptySet());

        Board board = new Board();
        board.setTeam(team);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(boardRepository.findById(boardId)).thenReturn(Optional.of(board));

        assertThrows(UnauthorizedException.class,
                () -> boardService.updateBoard(boardId, new UpdateBoardDTO(), userId));
    }

    @Test
    void updateBoard_updatesFieldsAndSaves() throws Exception {
        UUID userId = UUID.randomUUID();
        UUID boardId = UUID.randomUUID();

        User user = new User();
        Team team = new Team();
        team.setMembers(Set.of(user));

        Board board = new Board();
        board.setTeam(team);
        board.setTitle("Old Title");
        board.setContent("Old Content");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(boardRepository.findById(boardId)).thenReturn(Optional.of(board));
        when(boardRepository.save(any(Board.class))).thenAnswer(i -> i.getArgument(0));

        UpdateBoardDTO updateDto = new UpdateBoardDTO();
        updateDto.setTitle(Optional.of("New Title"));
        updateDto.setContent(Optional.of("New Content"));
        updateDto.setPreviewUrl(Optional.of("http://preview.url"));

        Board updated = boardService.updateBoard(boardId, updateDto, userId);

        assertEquals("New Title", updated.getTitle());
        assertEquals("New Content", updated.getContent());
        assertEquals("http://preview.url", updated.getPreviewUrl());
        assertNotNull(updated.getUpdatedAt());

        verify(boardRepository).save(updated);
    }
}
