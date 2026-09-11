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
                // SameSite=None (et non Strict) car le frontend (Vercel) et le backend (Render)
                // vivent sur deux domaines différents en production : un cookie Strict ne serait
                // jamais envoyé sur les appels cross-site du frontend vers l'API. La protection
                // CSRF repose à la place sur la configuration CORS (cf. SecurityConfig).
                .sameSite("None")
                .path("/")
                .maxAge(maxAge)
                .build();
    }

    static ResponseCookie expired() {
        return of("", Duration.ZERO);
    }
}
