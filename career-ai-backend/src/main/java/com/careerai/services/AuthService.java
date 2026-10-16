package com.careerai.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.careerai.exception.AuthenticationException;

import com.careerai.dto.LoginRequest;
import com.careerai.dto.LoginResponse;
import com.careerai.entity.User;
import com.careerai.repository.UserRepository;
import com.careerai.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;



    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService=jwtService;
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow (() ->new AuthenticationException
                        ("Invalid email or password"));

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {
            throw new AuthenticationException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole());

        return new LoginResponse(
                "Login successful",
                user.getEmail(),
                token
        );
    }
}
