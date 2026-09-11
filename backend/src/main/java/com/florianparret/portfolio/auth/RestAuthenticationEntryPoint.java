package com.florianparret.portfolio.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

/**
 * Spring Security appelle ceci quand l'accès à une route protégée est refusé faute
 * d'authentification, AVANT que la requête n'atteigne un @RestController — donc en dehors
 * de la portée d'un @RestControllerAdvice classique. On produit ici la même forme de
 * réponse JSON (ApiError) que le reste de l'API pour rester cohérent.
 */
@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(
                """
                {"timestamp":"%s","status":401,"error":"Unauthorized","message":"Authentification requise","path":"%s"}
                """
                        .formatted(Instant.now(), request.getRequestURI())
                        .strip());
    }
}
