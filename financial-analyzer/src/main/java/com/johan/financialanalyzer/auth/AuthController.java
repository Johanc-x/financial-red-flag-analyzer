package com.johan.financialanalyzer.auth;

import com.johan.financialanalyzer.security.JwtService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtService jwtService;

    public AuthController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        if ("admin".equals(request.getUsername()) &&
            "password123".equals(request.getPassword())) {

            String token = jwtService.generateToken(request.getUsername());
            return new LoginResponse(token);
        }

        throw new RuntimeException("Invalid credentials");
    }
}