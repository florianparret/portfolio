package com.florianparret.portfolio.project;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class ProjectControllerIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProjectRepository projectRepository;

    @BeforeEach
    void setUp() {
        projectRepository.deleteAll();
        projectRepository.save(new Project(
                "portfolio",
                "Portfolio Full-Stack",
                "Next.js + Spring Boot",
                List.of("Next.js", "Spring Boot", "PostgreSQL"),
                "https://github.com/example/portfolio",
                null));
    }

    @Test
    void listsAllProjects() throws Exception {
        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].slug").value("portfolio"));
    }

    @Test
    void returnsAProjectBySlug() throws Exception {
        mockMvc.perform(get("/api/projects/portfolio"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Portfolio Full-Stack"))
                .andExpect(jsonPath("$.stack", hasSize(3)));
    }

    @Test
    void returns404ForAnUnknownSlug() throws Exception {
        mockMvc.perform(get("/api/projects/does-not-exist"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }
}
