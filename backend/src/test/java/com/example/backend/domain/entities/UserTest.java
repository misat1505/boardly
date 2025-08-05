package com.example.backend.domain.entities;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

public class UserTest {

    private User user;
    private UUID userId;
    private final String username = "testuser";
    private final String givenName = "Test";
    private final String email = "test@example.com";
    private final String imageUrl = "http://example.com/image.png";
    private final boolean isPremium = true;

    @BeforeEach
    public void setup() {
        userId = UUID.randomUUID();
        user = new User(userId, username, givenName, email, imageUrl, isPremium);
    }

    @Test
    public void testConstructorAndGetters() {
        assertEquals(userId, user.getId());
        assertEquals(username, user.getUsername());
        assertEquals(givenName, user.getGivenName());
        assertEquals(email, user.getEmail());
        assertEquals(imageUrl, user.getImageUrl());
        assertTrue(user.getIsPremium());
        assertNotNull(user.getTeams());
        assertTrue(user.getTeams().isEmpty());
    }

    @Test
    public void testSetters() {
        UUID newId = UUID.randomUUID();
        user.setId(newId);
        user.setUsername("newuser");
        user.setGivenName("New");
        user.setEmail("new@example.com");
        user.setImageUrl("http://example.com/new.png");
        user.setIsPremium(false);

        assertEquals(newId, user.getId());
        assertEquals("newuser", user.getUsername());
        assertEquals("New", user.getGivenName());
        assertEquals("new@example.com", user.getEmail());
        assertEquals("http://example.com/new.png", user.getImageUrl());
        assertFalse(user.getIsPremium());
    }

    @Test
    public void testTeamsSetterAndGetter() {
        Team team1 = new Team(); // Assuming a default constructor exists
        Team team2 = new Team();

        Set<Team> teams = new HashSet<>();
        teams.add(team1);
        teams.add(team2);

        user.setTeams(teams);

        assertEquals(2, user.getTeams().size());
        assertTrue(user.getTeams().contains(team1));
        assertTrue(user.getTeams().contains(team2));
    }

    @Test
    public void testNoArgsConstructor() {
        User newUser = new User();
        assertNotNull(newUser.getTeams());
        assertTrue(newUser.getTeams().isEmpty());
    }
}

