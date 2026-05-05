package com.johan.financialanalyzer.auth;

import com.johan.financialanalyzer.model.User;
import com.johan.financialanalyzer.security.JwtService;
import com.johan.financialanalyzer.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtService jwtService;
    private final AuthService authService;

    public AuthController(JwtService jwtService, AuthService authService) {
        this.jwtService = jwtService;
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        User user = authService.authenticate(
                request.getUsername(), 
                request.getPassword()
        );

        String token = jwtService.generateToken(user.getUsername());

        return new LoginResponse(token);
    }
}