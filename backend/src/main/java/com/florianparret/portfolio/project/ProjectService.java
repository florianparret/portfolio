package com.florianparret.portfolio.project;

import com.florianparret.portfolio.common.web.ResourceConflictException;
import com.florianparret.portfolio.common.web.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<ProjectResponse> findAll() {
        return projectRepository.findAll().stream()
                .map(ProjectResponse::from)
                .toList();
    }

    public ProjectResponse findBySlug(String slug) {
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Aucun projet avec le slug \"" + slug + "\""));
        return ProjectResponse.from(project);
    }

    public ProjectResponse create(ProjectRequest request) {
        if (projectRepository.findBySlug(request.slug()).isPresent()) {
            throw new ResourceConflictException("Un projet avec le slug \"" + request.slug() + "\" existe déjà");
        }

        Project project = new Project(
                request.slug(), request.title(), request.description(), request.stack(), request.repoUrl(), request.demoUrl());
        return ProjectResponse.from(projectRepository.save(project));
    }

    public ProjectResponse update(String slug, ProjectUpdateRequest request) {
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Aucun projet avec le slug \"" + slug + "\""));
        project.update(request.title(), request.description(), request.stack(), request.repoUrl(), request.demoUrl());
        return ProjectResponse.from(projectRepository.save(project));
    }

    public void delete(String slug) {
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Aucun projet avec le slug \"" + slug + "\""));
        projectRepository.delete(project);
    }
}
