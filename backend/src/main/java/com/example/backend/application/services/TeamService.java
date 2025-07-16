package com.example.backend.application.services;

import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.backend.domain.entities.Team;
import com.example.backend.infrastructure.TeamRepository;

@Service
public class TeamService {
  private final TeamRepository teamRepository;

  public TeamService(TeamRepository teamRepository) {
    this.teamRepository = teamRepository;
  }

  public Set<Team> getUserTeams(UUID userId) {
    return teamRepository.findAllByMemberId(userId);
  }
}
