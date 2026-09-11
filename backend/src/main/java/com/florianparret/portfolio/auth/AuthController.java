package com.florianparret.portfolio.auth;

import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AdminAuthenticationService adminAuthenticationService;
    private final JwtService jwtService;
    private final long expirationMinutes;

    public AuthController(
            AdminAuthenticationService adminAuthenticationService,
            JwtService jwtService,
            @Value("${app.jwt.expiration-minutes}") long expirationMinutes) {
        this.adminAuthenticationService = adminAuthenticationService;
        this.jwtService = jwtService;
        this.expirationMinutes = expirationMinutes;
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody LoginRequest request) {
        adminAuthenticationService.authenticate(request.username(), request.password());
        String token = jwtService.generateToken(request.username());
        var cookie = AuthCookie.of(token, Duration.ofMinutes(expirationMinutes));

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, AuthCookie.expired().toString())
                .build();
    }
}
