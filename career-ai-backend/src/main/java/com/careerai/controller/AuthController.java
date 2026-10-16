package com.careerai.controller;

import com.careerai.dto.LoginRequest;
import com.careerai.dto.LoginResponse;
import com.careerai.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("JWT authentication is working!");
    }

    @GetMapping("/admin-test")
    public ResponseEntity<String> adminTest() {
        return ResponseEntity.ok("ADMIN role is working!");
    }
}
