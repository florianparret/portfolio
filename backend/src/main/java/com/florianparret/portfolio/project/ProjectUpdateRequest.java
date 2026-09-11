package com.florianparret.portfolio.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record ProjectUpdateRequest(
        @NotBlank String title,
        @NotBlank String description,
        @NotEmpty List<@NotBlank String> stack,
        String repoUrl,
        String demoUrl) {
}
