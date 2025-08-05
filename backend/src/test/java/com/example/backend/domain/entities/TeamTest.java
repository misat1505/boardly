package com.example.backend.domain.entities;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

public class TeamTest {
    private Team team;
    private UUID teamId;
    private final String name = "Dev Team";

    @BeforeEach
    public void setup() {
        teamId = UUID.randomUUID();
        team = new Team(teamId, name);
    }

    @Test
    public void testConstructorAndGetters() {
        assertEquals(teamId, team.getId());
        assertEquals(name, team.getName());
        assertNotNull(team.getMembers());
        assertTrue(team.getMembers().isEmpty());
    }

    @Test
    public void testSetters() {
        UUID newId = UUID.randomUUID();
        String newName = "Marketing Team";

        team.setId(newId);
        team.setName(newName);
        team.setIsUpgraded(true);

        assertEquals(newId, team.getId());
        assertEquals(newName, team.getName());
        assertTrue(team.getIsUpgraded());
    }

    @Test
    public void testMembersSetterAndGetter() {
        User user1 = new User();
        User user2 = new User();

        Set<User> members = new HashSet<>();
        members.add(user1);
        members.add(user2);

        team.setMembers(members);

        assertEquals(2, team.getMembers().size());
        assertTrue(team.getMembers().contains(user1));
        assertTrue(team.getMembers().contains(user2));
    }

    @Test
    public void testNoArgsConstructor() {
        Team newTeam = new Team();
        assertNull(newTeam.getId());
        assertNull(newTeam.getName());
        assertNotNull(newTeam.getMembers());
        assertTrue(newTeam.getMembers().isEmpty());
        assertFalse(newTeam.getIsUpgraded());
    }
}
