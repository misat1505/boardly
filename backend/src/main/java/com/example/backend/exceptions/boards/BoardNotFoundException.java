package com.example.backend.exceptions.boards;

import com.example.backend.exceptions.HttpException;
import org.springframework.http.HttpStatus;

public class BoardNotFoundException extends HttpException {
    private static final String DEFAULT_MESSAGE = "Board not found";

    public BoardNotFoundException() {
        super(DEFAULT_MESSAGE);
    }

    public BoardNotFoundException(String message) {
        super(message);
    }

    @Override
    public HttpStatus getStatus() {
        return HttpStatus.NOT_FOUND;
    }
}
