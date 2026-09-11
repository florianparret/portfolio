package com.florianparret.portfolio.project;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.servlet.http.Cookie;
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
class ProjectWriteControllerIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProjectRepository projectRepository;

    private Cookie authCookie;

    @BeforeEach
    void setUp() throws Exception {
        projectRepository.deleteAll();

        var loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"admin\",\"password\":\"changeme\"}"))
                .andReturn();
        authCookie = loginResult.getResponse().getCookie("auth_token");
    }

    @Test
    void creatingAProjectWithoutAuthenticationReturns401() throws Exception {
        mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(projectJson("portfolio")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createsAProjectWhenAuthenticated() throws Exception {
        mockMvc.perform(post("/api/projects")
                        .cookie(authCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(projectJson("portfolio")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.slug").value("portfolio"));
    }

    @Test
    void rejectsACreateWithADuplicateSlug() throws Exception {
        mockMvc.perform(post("/api/projects")
                        .cookie(authCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(projectJson("dup")))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/projects")
                        .cookie(authCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(projectJson("dup")))
                .andExpect(status().isConflict());
    }

    @Test
    void rejectsACreateWithAMissingTitle() throws Exception {
        String invalidJson =
                "{\"slug\":\"portfolio\",\"title\":\"\",\"description\":\"desc\",\"stack\":[\"Java\"]}";

        mockMvc.perform(post("/api/projects")
                        .cookie(authCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updatesAProjectButKeepsItsSlug() throws Exception {
        mockMvc.perform(post("/api/projects")
                        .cookie(authCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(projectJson("portfolio")))
                .andExpect(status().isCreated());

        String update = "{\"title\":\"Nouveau titre\",\"description\":\"Nouvelle description\",\"stack\":[\"Next.js\"]}";

        mockMvc.perform(put("/api/projects/portfolio")
                        .cookie(authCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(update))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug").value("portfolio"))
                .andExpect(jsonPath("$.title").value("Nouveau titre"));
    }

    @Test
    void updatingAnUnknownSlugReturns404() throws Exception {
        String update = "{\"title\":\"Titre\",\"description\":\"Description\",\"stack\":[\"Java\"]}";

        mockMvc.perform(put("/api/projects/does-not-exist")
                        .cookie(authCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(update))
                .andExpect(status().isNotFound());
    }

    @Test
    void deletesAProject() throws Exception {
        mockMvc.perform(post("/api/projects")
                        .cookie(authCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(projectJson("portfolio")))
                .andExpect(status().isCreated());

        mockMvc.perform(delete("/api/projects/portfolio").cookie(authCookie))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/projects/portfolio")).andExpect(status().isNotFound());
    }

    @Test
    void deletingWithoutAuthenticationReturns401() throws Exception {
        mockMvc.perform(delete("/api/projects/portfolio")).andExpect(status().isUnauthorized());
    }

    private static String projectJson(String slug) {
        return "{\"slug\":\"%s\",\"title\":\"Portfolio\",\"description\":\"desc\",\"stack\":[\"Java\",\"Spring Boot\"]}"
                .formatted(slug);
    }
}
