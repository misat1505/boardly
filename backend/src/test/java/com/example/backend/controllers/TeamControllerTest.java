package com.example.backend.controllers;

import com.example.backend.application.services.TeamService;
import com.example.backend.domain.dtos.CreateTeamDTO;
import com.example.backend.domain.dtos.InviteUserToTeamDTO;
import com.example.backend.domain.entities.Team;
import com.example.backend.domain.entities.User;
import com.example.backend.exceptions.teams.TeamCreationException;
import com.example.backend.exceptions.users.UserNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class TeamControllerTest {

    private final TeamService teamService = mock(TeamService.class);
    private final TeamController controller = new TeamController(teamService);

    @Test
    void getUserTeams_returnsTeams() throws UserNotFoundException {
        User user = new User();
        UUID userId = UUID.randomUUID();
        user.setId(userId);

        Set<Team> mockTeams = Set.of(new Team(), new Team());
        when(teamService.getUserTeams(userId)).thenReturn(mockTeams);

        ResponseEntity<Set<Team>> response = controller.getUserTeams(user);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockTeams, response.getBody());
        verify(teamService).getUserTeams(userId);
    }

    @Test
    void createTeam_returnsCreatedTeam() throws TeamCreationException, UserNotFoundException {
        User user = new User();
        UUID userId = UUID.randomUUID();
        user.setId(userId);

        CreateTeamDTO dto = new CreateTeamDTO();
        Team createdTeam = new Team();
        when(teamService.createTeam(dto, userId)).thenReturn(createdTeam);

        ResponseEntity<Team> response = controller.createTeam(dto, user);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(createdTeam, response.getBody());
        verify(teamService).createTeam(dto, userId);
    }

    @Test
    void inviteUserToTeam_returnsCreatedStatus() throws Exception {
        User user = new User();
        UUID userId = UUID.randomUUID();
        user.setId(userId);

        UUID teamId = UUID.randomUUID();
        InviteUserToTeamDTO dto = new InviteUserToTeamDTO();

        doNothing().when(teamService).inviteUserToTeam(teamId, dto, userId);

        ResponseEntity<String> response = controller.inviteUserToTeam(teamId, dto, user);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("User invited", response.getBody());
        verify(teamService).inviteUserToTeam(teamId, dto, userId);
    }
}

