package com.example.backend.exceptions.teams;

import com.example.backend.exceptions.HttpException;
import org.springframework.http.HttpStatus;

public class TooManyTeamsException extends HttpException {
    public TooManyTeamsException(String message) {
        super(message);
    }

    @Override
    public HttpStatus getStatus() {
        return HttpStatus.CONFLICT;
    }
}
