package com.example.backend.domain.entities;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "\"user\"")
public class User {

    @Id
    @GeneratedValue
    private UUID id;

    private String username;

    private String email;

    private String imageUrl;

    public User() {}

    public User(UUID id, String username, String email, String imageUrl) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.imageUrl = imageUrl;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
