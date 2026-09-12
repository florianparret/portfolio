package com.florianparret.portfolio.contact;

import com.florianparret.portfolio.common.web.TooManyRequestsException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;
    private final ContactRateLimiter contactRateLimiter;
    private final ContactNotificationService contactNotificationService;

    public ContactService(
            ContactMessageRepository contactMessageRepository,
            ContactRateLimiter contactRateLimiter,
            ContactNotificationService contactNotificationService) {
        this.contactMessageRepository = contactMessageRepository;
        this.contactRateLimiter = contactRateLimiter;
        this.contactNotificationService = contactNotificationService;
    }

    public void submit(ContactRequest request, String clientIp) {
        if (StringUtils.hasText(request.website())) {
            // Honeypot rempli : probablement un bot. On fait comme si tout s'était bien passé,
            // sans rien enregistrer ni envoyer, pour ne pas lui laisser deviner qu'il a été détecté.
            return;
        }

        if (!contactRateLimiter.allow(clientIp)) {
            throw new TooManyRequestsException("Trop de messages envoyés récemment, réessaie plus tard.");
        }

        ContactMessage message = new ContactMessage(request.name(), request.email(), request.message());
        contactMessageRepository.save(message);
        contactNotificationService.notifyNewMessage(message);
    }
}
