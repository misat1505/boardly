package com.example.backend.controllers;

import com.example.backend.application.services.UserService;
import com.example.backend.domain.entities.User;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

class UserControllerTest {

    private final UserService userService = mock(UserService.class);
    private final UserController controller = new UserController(userService);

    @Test
    void searchUsers_returnsMatchingUsers() {
        String query = "john";

        User user1 = new User();
        user1.setUsername("john123");
        User user2 = new User();
        user2.setUsername("john_smith");

        List<User> users = List.of(user1, user2);

        when(userService.searchByPartialUsername(query)).thenReturn(users);

        List<User> result = controller.searchUsers(query);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("john123", result.get(0).getUsername());
        assertEquals("john_smith", result.get(1).getUsername());

        verify(userService, times(1)).searchByPartialUsername(query);
    }
}
