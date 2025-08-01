package com.example.backend.exceptions.teams;

import com.example.backend.exceptions.HttpException;
import org.springframework.http.HttpStatus;

public class TooManyTeamsException extends HttpException {
    private static String DEFAULT_MESSAGE = "Too many teams";

    public TooManyTeamsException() {
        super(DEFAULT_MESSAGE);
    }

    public TooManyTeamsException(String message) {
        super(message);
    }

    @Override
    public HttpStatus getStatus() {
        return HttpStatus.CONFLICT;
    }
}
