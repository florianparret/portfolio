package com.florianparret.portfolio.project;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.List;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(nullable = false, columnDefinition = "text[]")
    private List<String> stack;

    @Column(name = "repo_url")
    private String repoUrl;

    @Column(name = "demo_url")
    private String demoUrl;

    protected Project() {
    }

    public Project(String slug, String title, String description, List<String> stack, String repoUrl, String demoUrl) {
        this.slug = slug;
        this.title = title;
        this.description = description;
        this.stack = stack;
        this.repoUrl = repoUrl;
        this.demoUrl = demoUrl;
    }

    public Long getId() {
        return id;
    }

    public String getSlug() {
        return slug;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public List<String> getStack() {
        return stack;
    }

    public String getRepoUrl() {
        return repoUrl;
    }

    public String getDemoUrl() {
        return demoUrl;
    }

    public void update(String title, String description, List<String> stack, String repoUrl, String demoUrl) {
        this.title = title;
        this.description = description;
        this.stack = stack;
        this.repoUrl = repoUrl;
        this.demoUrl = demoUrl;
    }
}
