package com.florianparret.portfolio.auth;

import java.time.Duration;
import org.springframework.http.ResponseCookie;

final class AuthCookie {

    static final String NAME = "auth_token";

    private AuthCookie() {
    }

    static ResponseCookie of(String token, Duration maxAge) {
        return ResponseCookie.from(NAME, token)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(maxAge)
                .build();
    }

    static ResponseCookie expired() {
        return of("", Duration.ZERO);
    }
}
