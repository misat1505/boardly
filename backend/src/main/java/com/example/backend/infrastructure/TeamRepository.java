package com.example.backend.infrastructure;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.domain.entities.Team;

public interface TeamRepository extends JpaRepository<Team, UUID> {}

