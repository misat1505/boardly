package com.example.backend.exceptions;

import com.example.backend.exceptions.auth.InvalidTokenException;
import com.example.backend.exceptions.boards.BoardNotFoundException;
import com.example.backend.exceptions.boards.TooManyBoardsException;
import com.example.backend.exceptions.payments.InvalidPaymentTypeException;
import com.example.backend.exceptions.payments.MetadataException;
import com.example.backend.exceptions.teams.TeamCreationException;
import com.example.backend.exceptions.teams.TeamNotFoundException;
import com.example.backend.exceptions.teams.TooManyTeamsException;
import com.example.backend.exceptions.users.UnauthorizedException;
import com.example.backend.exceptions.users.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(ex.getStatus()).body(ex.getMessage());
    }

    @ExceptionHandler(TeamNotFoundException.class)
    public ResponseEntity<String> handleTeamNotFound(TeamNotFoundException ex) {
        return ResponseEntity.status(ex.getStatus()).body(ex.getMessage());
    }

    @ExceptionHandler(BoardNotFoundException.class)
    public ResponseEntity<String> handleBoardNotFound(BoardNotFoundException ex) {
        return ResponseEntity.status(ex.getStatus()).body(ex.getMessage());
    }

    @ExceptionHandler(TeamCreationException.class)
    public ResponseEntity<String> handleTeamCreationException(TeamCreationException ex) {
        return ResponseEntity.status(ex.getStatus()).body(ex.getMessage());
    }

    @ExceptionHandler(TooManyTeamsException.class)
    public ResponseEntity<String> handleTooManyTeamsException(TooManyTeamsException ex) {
        return ResponseEntity.status(ex.getStatus()).body(ex.getMessage());
    }

    @ExceptionHandler(TooManyBoardsException.class)
    public ResponseEntity<String> handleTooManyBoardsException(TooManyBoardsException ex) {
        return ResponseEntity.status(ex.getStatus()).body(ex.getMessage());
    }

    @ExceptionHandler(InvalidPaymentTypeException.class)
    public ResponseEntity<String> handleInvalidPaymentTypeException(
            InvalidPaymentTypeException ex) {
        return ResponseEntity.status(ex.getStatus()).body(ex.getMessage());
    }

    @ExceptionHandler(MetadataException.class)
    public ResponseEntity<String> handleMetadataException(MetadataException ex) {
        return ResponseEntity.status(ex.getStatus()).body(ex.getMessage());
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<String> handleInvalidTokenException(InvalidTokenException ex) {
        return ResponseEntity.status(ex.getStatus()).body(ex.getMessage());
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<String> handleUnauthorizedException(UnauthorizedException ex) {
        return ResponseEntity.status(ex.getStatus()).body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAllExceptions(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An unexpected error occurred: " + ex.getMessage());
    }
}

