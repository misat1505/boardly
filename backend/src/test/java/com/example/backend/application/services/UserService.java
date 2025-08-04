package com.example.backend.application.services;

import com.example.backend.domain.entities.User;
import com.example.backend.infrastructure.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

class UserServiceTest {

    private UserRepository userRepository;
    private UserService userService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        userService = new UserService(userRepository);
    }

    @Test
    void searchByPartialUsername_returnsMatchingUsers() {
        String searchString = "john";
        User user1 = new User(UUID.randomUUID(), "john123", "John", "john@gmail.com", "https://image" +
                ".com/image" +
                ".png", false);
        User user2 = new User(UUID.randomUUID(), "JohnDoe", "John", "john@gmail.com", "https://image" +
                ".com/image" +
                ".png", false);
        List<User> expectedUsers = List.of(user1, user2);

        when(userRepository.findByUsernameContainingIgnoreCase("john"))
                .thenReturn(expectedUsers);

        List<User> result = userService.searchByPartialUsername("john");

        assertEquals(2, result.size());
        assertTrue(result.contains(user1));
        assertTrue(result.contains(user2));
    }

    @Test
    void searchByPartialUsername_returnsEmptyList_whenSearchStringIsEmpty() {
        List<User> result = userService.searchByPartialUsername("");

        assertTrue(result.isEmpty());
        verify(userRepository, never()).findByUsernameContainingIgnoreCase(any());
    }
}

