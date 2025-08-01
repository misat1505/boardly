package com.example.backend.exceptions.auth;

import com.example.backend.exceptions.HttpException;
import org.springframework.http.HttpStatus;

public class InvalidTokenException extends HttpException {
    private static String DEFAULT_MESSAGE = "Invalid token";

    public InvalidTokenException() {
        super(DEFAULT_MESSAGE);
    }

    public InvalidTokenException(String message) {
        super(message);
    }

    @Override
    public HttpStatus getStatus() {
        return HttpStatus.UNAUTHORIZED;
    }
}
