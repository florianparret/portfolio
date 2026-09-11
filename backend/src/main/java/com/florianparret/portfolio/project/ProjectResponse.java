package com.florianparret.portfolio.project;

import java.util.List;

public record ProjectResponse(
        String slug,
        String title,
        String description,
        List<String> stack,
        String repoUrl,
        String demoUrl) {

    public static ProjectResponse from(Project project) {
        return new ProjectResponse(
                project.getSlug(),
                project.getTitle(),
                project.getDescription(),
                project.getStack(),
                project.getRepoUrl(),
                project.getDemoUrl());
    }
}
