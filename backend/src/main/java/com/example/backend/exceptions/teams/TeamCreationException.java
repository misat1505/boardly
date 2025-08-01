package com.example.backend.exceptions.teams;

import com.example.backend.exceptions.HttpException;
import org.springframework.http.HttpStatus;

public class TeamCreationException extends HttpException {
    public TeamCreationException(String message) {
        super(message);
    }

    @Override
    public HttpStatus getStatus() {
        return HttpStatus.BAD_REQUEST;
    }
}
