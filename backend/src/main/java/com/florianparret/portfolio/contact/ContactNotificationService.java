package com.florianparret.portfolio.contact;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
class ContactNotificationService {

    private static final Logger log = LoggerFactory.getLogger(ContactNotificationService.class);

    private final JavaMailSender mailSender;
    private final String notificationEmail;

    ContactNotificationService(
            JavaMailSender mailSender,
            @Value("${app.contact.notification-email}") String notificationEmail) {
        this.mailSender = mailSender;
        this.notificationEmail = notificationEmail;
    }

    // Asynchrone et best-effort : un souci d'envoi (SMTP lent, indisponible...) ne doit jamais
    // faire échouer la soumission du formulaire pour le visiteur, le message est déjà enregistré.
    @Async
    void notifyNewMessage(ContactMessage message) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(notificationEmail);
            mail.setReplyTo(message.getEmail());
            mail.setSubject("Nouveau message de contact — " + message.getName());
            mail.setText("De : %s <%s>\n\n%s".formatted(message.getName(), message.getEmail(), message.getMessage()));
            mailSender.send(mail);
        } catch (Exception e) {
            log.warn("Échec de l'envoi de l'email de notification pour le message de contact {}", message.getId(), e);
        }
    }
}
