package com.florianparret.portfolio.auth;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class JwtServiceTest {

    private final JwtService jwtService = new JwtService("test-secret-please-at-least-32-chars-long", 60);

    @Test
    void generatesATokenThatIsValidAndCarriesTheUsername() {
        String token = jwtService.generateToken("admin");

        assertThat(jwtService.isValid(token)).isTrue();
        assertThat(jwtService.extractUsername(token)).isEqualTo("admin");
    }

    @Test
    void rejectsAMalformedToken() {
        assertThat(jwtService.isValid("not-a-jwt")).isFalse();
    }

    @Test
    void rejectsATokenSignedWithADifferentSecret() {
        JwtService otherService = new JwtService("another-secret-also-at-least-32-chars-long", 60);
        String token = otherService.generateToken("admin");

        assertThat(jwtService.isValid(token)).isFalse();
    }
}
