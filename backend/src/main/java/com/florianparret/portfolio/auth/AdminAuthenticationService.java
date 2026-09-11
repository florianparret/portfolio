package com.florianparret.portfolio.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminAuthenticationService {

    private final String adminUsername;
    private final String adminPasswordHash;
    private final PasswordEncoder passwordEncoder;

    public AdminAuthenticationService(
            @Value("${app.admin.username}") String adminUsername,
            @Value("${app.admin.password-hash}") String adminPasswordHash,
            PasswordEncoder passwordEncoder) {
        this.adminUsername = adminUsername;
        this.adminPasswordHash = adminPasswordHash;
        this.passwordEncoder = passwordEncoder;
    }

    public void authenticate(String username, String password) {
        boolean usernameMatches = adminUsername.equals(username);
        boolean passwordMatches = passwordEncoder.matches(password, adminPasswordHash);

        if (!usernameMatches || !passwordMatches) {
            throw new BadCredentialsException("Identifiants invalides");
        }
    }
}
