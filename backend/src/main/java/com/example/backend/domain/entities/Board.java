package com.example.backend.domain.entities;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import org.hibernate.annotations.Type;

@Entity
@Table(name = "board")
public class Board {

    @Id
    @GeneratedValue
    private UUID id;

    private String title;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private String content;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    public Board() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Instant getCreatedAt() {
        return createdAt;
    }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    
    public Instant getUpdatedAt() { return updatedAt; }

    public Team getTeam() { return team; }
    public void setTeam(Team team) { this.team = team; }
}
