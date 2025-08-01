package com.example.backend.infrastructure;

import com.example.backend.domain.entities.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;
import java.util.UUID;

public interface BoardRepository extends JpaRepository<Board, UUID> {
    Set<Board> findByTeamId(UUID teamId);
}
