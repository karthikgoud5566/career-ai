package com.careerai.exception;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.dao.DataIntegrityViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException exception) {

        Map<String, String> errors = new LinkedHashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(error.getField(), error.getDefaultMessage())
                );

        ValidationErrorResponse response =
                new ValidationErrorResponse(
                        HttpStatus.BAD_REQUEST.value(),
                        "Validation failed",
                        errors
                );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ValidationErrorResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException exception) {

        ValidationErrorResponse response =
                new ValidationErrorResponse(
                        HttpStatus.CONFLICT.value(),
                        "Email already exists",
                        null
                );

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ValidationErrorResponse> handleAuthenticationException(
            AuthenticationException exception) {

        ValidationErrorResponse response =
                new ValidationErrorResponse(
                        HttpStatus.UNAUTHORIZED.value(),
                        exception.getMessage(),
                        null
                );

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(response);
    }
}
