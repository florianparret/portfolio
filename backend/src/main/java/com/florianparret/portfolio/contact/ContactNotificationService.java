package com.florianparret.portfolio.contact;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

// Envoi via l'API HTTPS de Resend plutôt qu'en SMTP direct : Render bloque les ports SMTP
// sortants sur son tier gratuit (voir DEPLOYMENT.md §7.6). RestClient fait déjà partie de
// spring-web, aucune dépendance supplémentaire nécessaire.
@Service
class ContactNotificationService {

    private static final Logger log = LoggerFactory.getLogger(ContactNotificationService.class);

    private final RestClient restClient;
    private final String fromEmail;
    private final String notificationEmail;

    ContactNotificationService(
            RestClient.Builder restClientBuilder,
            @Value("${app.resend.api-key}") String apiKey,
            @Value("${app.resend.from-email}") String fromEmail,
            @Value("${app.contact.notification-email}") String notificationEmail) {
        this.restClient = restClientBuilder
                .baseUrl("https://api.resend.com")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
        this.fromEmail = fromEmail;
        this.notificationEmail = notificationEmail;
    }

    // Asynchrone et best-effort : un souci d'envoi (API indisponible, clé invalide...) ne doit
    // jamais faire échouer la soumission du formulaire pour le visiteur, le message est déjà
    // enregistré.
    @Async
    void notifyNewMessage(ContactMessage message) {
        try {
            ResendEmailRequest request = new ResendEmailRequest(
                    fromEmail,
                    List.of(notificationEmail),
                    "Nouveau message de contact — " + message.getName(),
                    "De : %s <%s>\n\n%s".formatted(message.getName(), message.getEmail(), message.getMessage()),
                    List.of(message.getEmail()));

            restClient.post().uri("/emails").body(request).retrieve().toBodilessEntity();
        } catch (Exception e) {
            log.warn("Échec de l'envoi de l'email de notification pour le message de contact {}", message.getId(), e);
        }
    }

    private record ResendEmailRequest(
            String from,
            List<String> to,
            String subject,
            String text,
            @JsonProperty("reply_to") List<String> replyTo) {
    }
}
