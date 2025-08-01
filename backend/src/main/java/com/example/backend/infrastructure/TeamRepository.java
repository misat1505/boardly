package com.example.backend.infrastructure;

import com.example.backend.domain.entities.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Set;
import java.util.UUID;

public interface TeamRepository extends JpaRepository<Team, UUID> {
    @Query("SELECT t FROM Team t JOIN t.members m WHERE m.id = :userId")
    Set<Team> findAllByMemberId(UUID userId);
}

