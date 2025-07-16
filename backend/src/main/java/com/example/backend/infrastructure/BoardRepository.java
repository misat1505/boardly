package com.example.backend.infrastructure;

import java.util.Set;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.domain.entities.Board;

public interface BoardRepository extends JpaRepository<Board, UUID> {
  Set<Board> findByTeamId(UUID teamId);
}
