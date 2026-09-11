import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ProjectsPage from "./page";

const mockProjects = [
  {
    slug: "test-project",
    title: "Projet de test",
    description: "Description de test",
    stack: ["Next.js", "Spring Boot"],
  },
];

describe("Projects page", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("affiche un titre et une carte par projet renvoyé par l'API", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockProjects,
    });

    render(await ProjectsPage());

    expect(
      screen.getByRole("heading", { level: 1, name: "Projets" }),
    ).toBeInTheDocument();

    for (const project of mockProjects) {
      expect(
        screen.getByRole("heading", { level: 2, name: project.title }),
      ).toBeInTheDocument();
      expect(screen.getByText(project.description)).toBeInTheDocument();
    }
  });

  it("affiche un message d'erreur si l'API est indisponible", async () => {
    fetchMock.mockRejectedValue(new Error("network error"));

    render(await ProjectsPage());

    expect(
      screen.getByText("Impossible de charger les projets pour le moment."),
    ).toBeInTheDocument();
  });

  it("affiche un message quand l'API ne renvoie aucun projet", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(await ProjectsPage());

    expect(
      screen.getByText("Aucun projet pour le moment."),
    ).toBeInTheDocument();
  });
});
