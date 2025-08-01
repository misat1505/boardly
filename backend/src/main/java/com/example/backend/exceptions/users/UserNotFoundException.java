package com.example.backend.exceptions.users;

import com.example.backend.exceptions.HttpException;
import org.springframework.http.HttpStatus;

public class UserNotFoundException extends HttpException {
    private static final String DEFAULT_MESSAGE = "User not found";

    public UserNotFoundException() {
        super(DEFAULT_MESSAGE);
    }

    public UserNotFoundException(String message) {
        super(message);
    }

    @Override
    public HttpStatus getStatus() {
        return HttpStatus.NOT_FOUND;
    }
}
