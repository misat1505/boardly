package com.example.backend.application.services;

import com.example.backend.domain.dtos.CreateTeamDTO;
import com.example.backend.domain.dtos.InviteUserToTeamDTO;
import com.example.backend.domain.entities.Team;
import com.example.backend.domain.entities.User;
import com.example.backend.exceptions.teams.TeamCreationException;
import com.example.backend.exceptions.teams.TeamNotFoundException;
import com.example.backend.exceptions.teams.TooManyTeamsException;
import com.example.backend.exceptions.users.UnauthorizedException;
import com.example.backend.exceptions.users.UserNotFoundException;
import com.example.backend.infrastructure.TeamRepository;
import com.example.backend.infrastructure.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TeamServiceTest {

    private TeamRepository teamRepository;
    private UserRepository userRepository;
    private TeamService teamService;

    private final int maxNonPremiumTeams = 3;

    @BeforeEach
    void setUp() {
        teamRepository = mock(TeamRepository.class);
        userRepository = mock(UserRepository.class);
        teamService = new TeamService(teamRepository, userRepository, maxNonPremiumTeams);
    }

    @Test
    void getUserTeams_existingUser_returnsTeams() throws UserNotFoundException {
        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setId(userId);

        Set<Team> teams = new HashSet<>();
        teams.add(new Team());
        teams.add(new Team());

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(teamRepository.findAllByMemberId(userId)).thenReturn(teams);

        Set<Team> result = teamService.getUserTeams(userId);

        assertEquals(teams, result);
    }

    @Test
    void getUserTeams_userNotFound_throwsUserNotFoundException() {
        UUID userId = UUID.randomUUID();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> teamService.getUserTeams(userId));
    }

    @Test
    void createTeam_premiumUser_createsTeam() throws TeamCreationException, UserNotFoundException {
        UUID userId = UUID.randomUUID();
        CreateTeamDTO dto = new CreateTeamDTO();
        dto.setName("New Team");

        User user = new User();
        user.setId(userId);
        user.setIsPremium(true);
        user.setTeams(new HashSet<>());

        Team savedTeam = new Team();
        savedTeam.setName(dto.getName());
        savedTeam.setMembers(Set.of(user));

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(teamRepository.findAllByMemberId(userId)).thenReturn(Collections.emptySet());
        when(teamRepository.save(any(Team.class))).thenReturn(savedTeam);
        when(userRepository.save(user)).thenReturn(user);

        Team result = teamService.createTeam(dto, userId);

        assertEquals(dto.getName(), result.getName());
        assertTrue(result.getMembers().contains(user));
        verify(userRepository).save(user);
    }

    @Test
    void createTeam_nonPremiumUserTooManyTeams_throwsTeamCreationException() {
        UUID userId = UUID.randomUUID();
        CreateTeamDTO dto = new CreateTeamDTO();
        dto.setName("New Team");

        User user = new User();
        user.setId(userId);
        user.setIsPremium(false);

        Set<Team> existingTeams = new HashSet<>();
        for (int i = 0; i < maxNonPremiumTeams; i++) {
            existingTeams.add(new Team());
        }

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(teamRepository.findAllByMemberId(userId)).thenReturn(existingTeams);

        TeamCreationException ex = assertThrows(TeamCreationException.class, () -> {
            teamService.createTeam(dto, userId);
        });

        assertTrue(ex.getMessage().contains("Non-premium users can only be part of"));
    }

    @Test
    void inviteUserToTeam_authorizedUser_invitesNonPremiumUserWithinLimit() throws Exception {
        UUID teamId = UUID.randomUUID();
        UUID authUserId = UUID.randomUUID();
        UUID invitedUserId = UUID.randomUUID();

        User authUser = new User();
        authUser.setId(authUserId);

        User invitedUser = new User();
        invitedUser.setId(invitedUserId);
        invitedUser.setIsPremium(false);
        invitedUser.setTeams(new HashSet<>());

        Team team = new Team();
        team.setMembers(new HashSet<>(Set.of(authUser)));

        InviteUserToTeamDTO inviteDTO = new InviteUserToTeamDTO();
        inviteDTO.setUserId(invitedUserId);

        when(userRepository.findById(authUserId)).thenReturn(Optional.of(authUser));
        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));
        when(userRepository.findById(invitedUserId)).thenReturn(Optional.of(invitedUser));
        when(teamRepository.findAllByMemberId(invitedUserId)).thenReturn(Collections.emptySet());
        when(teamRepository.save(team)).thenReturn(team);

        teamService.inviteUserToTeam(teamId, inviteDTO, authUserId);

        assertTrue(team.getMembers().contains(invitedUser));
        verify(teamRepository).save(team);
    }

    @Test
    void inviteUserToTeam_invitedUserTooManyTeams_throwsTooManyTeamsException() {
        UUID teamId = UUID.randomUUID();
        UUID authUserId = UUID.randomUUID();
        UUID invitedUserId = UUID.randomUUID();

        User authUser = new User();
        authUser.setId(authUserId);

        User invitedUser = new User();
        invitedUser.setId(invitedUserId);
        invitedUser.setIsPremium(false);

        Team team = new Team();
        team.setMembers(new HashSet<>(Set.of(authUser)));

        Set<Team> existingTeams = new HashSet<>();
        for (int i = 0; i < maxNonPremiumTeams; i++) {
            existingTeams.add(new Team());
        }

        InviteUserToTeamDTO inviteDTO = new InviteUserToTeamDTO();
        inviteDTO.setUserId(invitedUserId);

        when(userRepository.findById(authUserId)).thenReturn(Optional.of(authUser));
        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));
        when(userRepository.findById(invitedUserId)).thenReturn(Optional.of(invitedUser));
        when(teamRepository.findAllByMemberId(invitedUserId)).thenReturn(existingTeams);

        TooManyTeamsException ex = assertThrows(TooManyTeamsException.class, () -> {
            teamService.inviteUserToTeam(teamId, inviteDTO, authUserId);
        });

        assertTrue(ex.getMessage().contains("Non-premium users can only be part of"));
    }

    @Test
    void inviteUserToTeam_unauthorizedUser_throwsUnauthorizedException() {
        UUID teamId = UUID.randomUUID();
        UUID authUserId = UUID.randomUUID();

        User authUser = new User();
        authUser.setId(authUserId);

        Team team = new Team();
        team.setMembers(new HashSet<>()); // authUser not a member

        InviteUserToTeamDTO inviteDTO = new InviteUserToTeamDTO();
        inviteDTO.setUserId(UUID.randomUUID());

        when(userRepository.findById(authUserId)).thenReturn(Optional.of(authUser));
        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));

        assertThrows(UnauthorizedException.class, () -> {
            teamService.inviteUserToTeam(teamId, inviteDTO, authUserId);
        });
    }

    @Test
    void inviteUserToTeam_teamNotFound_throwsTeamNotFoundException() {
        UUID teamId = UUID.randomUUID();
        UUID authUserId = UUID.randomUUID();

        User authUser = new User();
        authUser.setId(authUserId);
        when(userRepository.findById(authUserId)).thenReturn(Optional.of(authUser));

        when(teamRepository.findById(teamId)).thenReturn(Optional.empty());

        InviteUserToTeamDTO inviteDTO = new InviteUserToTeamDTO();
        inviteDTO.setUserId(UUID.randomUUID());

        assertThrows(TeamNotFoundException.class, () -> {
            teamService.inviteUserToTeam(teamId, inviteDTO, authUserId);
        });
    }

    @Test
    void inviteUserToTeam_invitedUserNotFound_throwsUserNotFoundException() {
        UUID teamId = UUID.randomUUID();
        UUID authUserId = UUID.randomUUID();
        UUID invitedUserId = UUID.randomUUID();

        User authUser = new User();
        authUser.setId(authUserId);

        Team team = new Team();
        team.setMembers(new HashSet<>(Set.of(authUser)));

        InviteUserToTeamDTO inviteDTO = new InviteUserToTeamDTO();
        inviteDTO.setUserId(invitedUserId);

        when(userRepository.findById(authUserId)).thenReturn(Optional.of(authUser));
        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));
        when(userRepository.findById(invitedUserId)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> {
            teamService.inviteUserToTeam(teamId, inviteDTO, authUserId);
        });
    }
}
