package com.example.backend.application.services;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.backend.domain.dtos.CreateTeamDTO;
import com.example.backend.domain.entities.Team;
import com.example.backend.domain.entities.User;
import com.example.backend.infrastructure.TeamRepository;
import com.example.backend.infrastructure.UserRepository;

@Service
public class TeamService {
  private final TeamRepository teamRepository;
  private final UserRepository userRepository;

  public TeamService(TeamRepository teamRepository, UserRepository userRepository) {
    this.teamRepository = teamRepository;
    this.userRepository = userRepository;
  }

  public Set<Team> getUserTeams(UUID userId) {
    return teamRepository.findAllByMemberId(userId);
  }

  public Team createTeam(CreateTeamDTO createTeamDTO, User userFromContext) {
    User managedUser = userRepository.findById(userFromContext.getId())
        .orElseThrow(() -> new RuntimeException("User not found"));

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

}
