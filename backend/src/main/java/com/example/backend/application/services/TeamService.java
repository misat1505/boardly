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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
public class TeamService {
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    @Value("${MAX_NON_PREMIUM_TEAMS}")
    private int maxNonPremiumTeams;

    public TeamService(TeamRepository teamRepository, UserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
    }

    public Set<Team> getUserTeams(UUID userId) throws UserNotFoundException {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);

        return teamRepository.findAllByMemberId(user.getId());
    }

    public Team createTeam(CreateTeamDTO createTeamDTO, UUID userId)
            throws TeamCreationException, UserNotFoundException {
        User managedUser = userRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        if (!managedUser.getIsPremium()) {
            Set<Team> usersTeams = teamRepository.findAllByMemberId(managedUser.getId());
            if (usersTeams.size() >= maxNonPremiumTeams) {
                throw new TeamCreationException("Non-premium users can only be part of " + maxNonPremiumTeams + " teams.");
            }
        }

        Team team = new Team();
        team.setName(createTeamDTO.getName());

        Set<User> members = new HashSet<>();
        members.add(managedUser);
        team.setMembers(members);

        Team savedTeam = teamRepository.save(team);

        managedUser.getTeams().add(savedTeam);
        userRepository.save(managedUser);

        return savedTeam;
    }

    public void inviteUserToTeam(UUID teamId, InviteUserToTeamDTO inviteUserToTeamDTO,
                                 UUID authenticatedUserId)
            throws TeamNotFoundException, UserNotFoundException, TooManyTeamsException, UnauthorizedException {
        User authenticatedUser =
                userRepository.findById(authenticatedUserId).orElseThrow(UserNotFoundException::new);
        Team team = teamRepository.findById(teamId)
                .orElseThrow(TeamNotFoundException::new);
        if (!team.getMembers().contains(authenticatedUser)) throw new UnauthorizedException();

        User invitedUser = userRepository.findById(inviteUserToTeamDTO.getUserId())
                .orElseThrow(UserNotFoundException::new);

        if (!invitedUser.getIsPremium()) {
            Set<Team> usersTeams = teamRepository.findAllByMemberId(invitedUser.getId());
            if (usersTeams.size() >= maxNonPremiumTeams) {
                throw new TooManyTeamsException("Non-premium users can only be part of " + maxNonPremiumTeams + " teams.");
            }
        }

        if (!team.getMembers().contains(invitedUser)) {
            team.getMembers().add(invitedUser);
            teamRepository.save(team);
        }
    }

}
