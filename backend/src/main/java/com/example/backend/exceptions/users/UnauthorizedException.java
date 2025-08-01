package com.example.backend.exceptions.users;

import com.example.backend.exceptions.HttpException;
import org.springframework.http.HttpStatus;

public class UnauthorizedException extends HttpException {
    private static final String DEFAULT_MESSAGE = "User not found";

    public UnauthorizedException() {
        super(DEFAULT_MESSAGE);
    }

    public UnauthorizedException(String message) {
        super(message);
    }

    @Override
    public HttpStatus getStatus() {
        return HttpStatus.UNAUTHORIZED;
    }
}
