package com.example.backend.exceptions;

import org.springframework.http.HttpStatus;

public abstract class HttpException extends RuntimeException {
    public HttpException(String message) {
        super(message);
    }

    public abstract HttpStatus getStatus();
}

