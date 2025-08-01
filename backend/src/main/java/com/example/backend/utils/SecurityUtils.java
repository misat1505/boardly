package com.example.backend.utils;

import com.example.backend.domain.entities.User;
import com.example.backend.exceptions.users.UnauthorizedException;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {
    public static User getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal instanceof User user)) {
            throw new UnauthorizedException();
        }

        return user;
    }
}

