package com.example.backend.controllers;

import java.util.Set;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.backend.application.services.TeamService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.backend.domain.entities.Team;
import com.example.backend.domain.entities.User;



@RestController
@RequestMapping("/teams")
public class TeamController {
  private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

  @GetMapping
  public ResponseEntity<Set<Team>> getUserTeams() {
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    if (!(principal instanceof User user)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
        
    Set<Team> teams = teamService.getUserTeams(user.getId());
    return ResponseEntity.ok(teams);
  }
  
}
