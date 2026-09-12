package com.florianparret.portfolio.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @NotBlank String name,
        @NotBlank @Email String email,
        @NotBlank @Size(max = 2000) String message,
        // Honeypot anti-spam : un champ que seul un bot remplirait (invisible côté formulaire
        // humain). Volontairement sans validation, doit rester vide.
        String website) {
}
