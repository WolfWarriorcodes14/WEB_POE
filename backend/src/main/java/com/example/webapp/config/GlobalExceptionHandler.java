package com.example.webapp.config;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleError(Exception ex) {

        ex.printStackTrace(); // 🔥 SEE REAL ERROR IN TERMINAL

        return ResponseEntity
                .status(500)
                .body("ERROR: " + ex.getMessage());
    }
}