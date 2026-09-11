package com.florianparret.portfolio.project;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.dao.DataIntegrityViolationException;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class ProjectRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private ProjectRepository projectRepository;

    @Test
    void savesAndReadsAProject() {
        Project project = new Project(
                "portfolio",
                "Portfolio Full-Stack",
                "Next.js + Spring Boot",
                List.of("Next.js", "Spring Boot", "PostgreSQL"),
                "https://github.com/example/portfolio",
                null);

        Project saved = projectRepository.save(project);

        Optional<Project> found = projectRepository.findById(saved.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getSlug()).isEqualTo("portfolio");
        assertThat(found.get().getStack()).containsExactly("Next.js", "Spring Boot", "PostgreSQL");
    }

    @Test
    void rejectsDuplicateSlug() {
        projectRepository.saveAndFlush(new Project("dup", "A", "desc", List.of("Java"), null, null));

        Project duplicate = new Project("dup", "B", "desc", List.of("Java"), null, null);

        assertThatThrownBy(() -> projectRepository.saveAndFlush(duplicate))
                .isInstanceOf(DataIntegrityViolationException.class);
    }
}
