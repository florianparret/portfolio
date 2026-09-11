package com.florianparret.portfolio.contact;

import org.springframework.stereotype.Service;

@Service
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactService(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    public void submit(ContactRequest request) {
        ContactMessage message = new ContactMessage(request.name(), request.email(), request.message());
        contactMessageRepository.save(message);
    }
}
