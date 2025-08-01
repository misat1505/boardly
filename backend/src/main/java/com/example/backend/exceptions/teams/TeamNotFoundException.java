package com.example.backend.exceptions.teams;

import com.example.backend.exceptions.HttpException;
import org.springframework.http.HttpStatus;

public class TeamNotFoundException extends HttpException {
    private static final String DEFAULT_MESSAGE = "Team not found";

    public TeamNotFoundException() {
        super(DEFAULT_MESSAGE);
    }

    public TeamNotFoundException(String message) {
        super(message);
    }

    @Override
    public HttpStatus getStatus() {
        return HttpStatus.NOT_FOUND;
    }
}
