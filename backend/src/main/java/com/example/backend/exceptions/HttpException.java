package com.example.backend.exceptions;

import org.springframework.http.HttpStatus;

public abstract class HttpException extends Exception {
    public HttpException(String message) {
        super(message);
    }

    public abstract HttpStatus getStatus();
}

