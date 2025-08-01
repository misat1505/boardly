package com.example.backend.controllers;

import com.example.backend.application.services.TeamService;
import com.example.backend.domain.dtos.CreateTeamDTO;
import com.example.backend.domain.dtos.InviteUserToTeamDTO;
import com.example.backend.domain.entities.Team;
import com.example.backend.domain.entities.User;
import com.example.backend.exceptions.teams.TeamCreationException;
import com.example.backend.exceptions.teams.TeamNotFoundException;
import com.example.backend.exceptions.teams.TooManyTeamsException;
import com.example.backend.exceptions.users.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.UUID;


@RestController
@RequestMapping("/teams")
public class TeamController {
    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping
    public ResponseEntity<Set<Team>> getUserTeams(@AuthenticationPrincipal User user) {
        Set<Team> teams = teamService.getUserTeams(user.getId());
        return ResponseEntity.ok(teams);
    }

    @PostMapping
    public ResponseEntity<Team> createTeam(@RequestBody CreateTeamDTO createTeamDTO,
                                           @AuthenticationPrincipal User user)
            throws TeamCreationException, UserNotFoundException {
        Team team = teamService.createTeam(createTeamDTO, user);
        return ResponseEntity.ok(team);
    }

    @PostMapping("/{teamId}/invite")
    public ResponseEntity<String> inviteUserToTeam(@PathVariable UUID teamId,
                                                   @RequestBody InviteUserToTeamDTO dto)
            throws UserNotFoundException, TeamNotFoundException, TooManyTeamsException {
        teamService.inviteUserToTeam(teamId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body("User invited");
    }
}
