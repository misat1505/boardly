package com.example.backend.exceptions.payments;

import com.example.backend.exceptions.HttpException;
import org.springframework.http.HttpStatus;

public class InvalidPaymentTypeException extends HttpException {
    private static String DEFAULT_MESSAGE = "Invalid payment type";

    public InvalidPaymentTypeException() {
        super(DEFAULT_MESSAGE);
    }

    public InvalidPaymentTypeException(String message) {
        super(message);
    }

    @Override
    public HttpStatus getStatus() {
        return HttpStatus.BAD_REQUEST;
    }
}
