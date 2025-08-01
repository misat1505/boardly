package com.example.backend.exceptions.boards;

import com.example.backend.exceptions.HttpException;
import org.springframework.http.HttpStatus;

public class TooManyBoardsException extends HttpException {
    private static String DEFAULT_MESSAGE = "Too many boards";

    public TooManyBoardsException() {
        super(DEFAULT_MESSAGE);
    }

    public TooManyBoardsException(String message) {
        super(message);
    }

    @Override
    public HttpStatus getStatus() {
        return HttpStatus.CONFLICT;
    }
}
