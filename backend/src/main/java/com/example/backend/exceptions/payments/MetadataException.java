package com.example.backend.exceptions.payments;

import com.example.backend.exceptions.HttpException;
import org.springframework.http.HttpStatus;

public class MetadataException extends HttpException {
    private static String DEFAULT_MESSAGE = "Metadata exception";

    public MetadataException() {
        super(DEFAULT_MESSAGE);
    }

    public MetadataException(String message) {
        super(message);
    }

    @Override
    public HttpStatus getStatus() {
        return HttpStatus.BAD_REQUEST;
    }
}
