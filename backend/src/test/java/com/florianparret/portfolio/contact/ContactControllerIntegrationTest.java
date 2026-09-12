package com.florianparret.portfolio.contact;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class ContactControllerIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @BeforeEach
    void setUp() {
        contactMessageRepository.deleteAll();
    }

    @Test
    void submittingAValidMessageReturns201AndPersistsIt() throws Exception {
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(contactJson("Jane Doe", "jane@example.com", "Bonjour, intéressé par votre profil.")))
                .andExpect(status().isCreated());

        assertThat(contactMessageRepository.findAll()).hasSize(1);
        ContactMessage saved = contactMessageRepository.findAll().get(0);
        assertThat(saved.getName()).isEqualTo("Jane Doe");
        assertThat(saved.getEmail()).isEqualTo("jane@example.com");
        assertThat(saved.getMessage()).isEqualTo("Bonjour, intéressé par votre profil.");
        assertThat(saved.getCreatedAt()).isNotNull();
    }

    @Test
    void submittingWithoutAuthenticationStillWorks() throws Exception {
        // La route est publique : aucun cookie auth_token n'est fourni ici, contrairement
        // aux tests d'écriture sur /api/projects.
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(contactJson("Jane Doe", "jane@example.com", "Message de test.")))
                .andExpect(status().isCreated());
    }

    @Test
    void rejectsAnInvalidEmail() throws Exception {
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(contactJson("Jane Doe", "not-an-email", "Message de test.")))
                .andExpect(status().isBadRequest());

        assertThat(contactMessageRepository.findAll()).isEmpty();
    }

    @Test
    void rejectsAMissingName() throws Exception {
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(contactJson("", "jane@example.com", "Message de test.")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rejectsAnEmptyMessage() throws Exception {
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(contactJson("Jane Doe", "jane@example.com", "")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void honeypotFilledReturns201ButDoesNotPersistAnything() throws Exception {
        String json =
                """
                {"name":"Bot","email":"bot@example.com","message":"spam","website":"http://spam.example"}""";

        mockMvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isCreated());

        assertThat(contactMessageRepository.findAll()).isEmpty();
    }

    private static String contactJson(String name, String email, String message) {
        return "{\"name\":\"%s\",\"email\":\"%s\",\"message\":\"%s\"}".formatted(name, email, message);
    }
}
