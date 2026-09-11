import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProjectDetailPage, { generateMetadata } from "./page";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

const fetchProjectMock = vi.fn();

vi.mock("@/lib/api", () => ({
  fetchProject: (slug: string) => fetchProjectMock(slug),
}));

const mockProject = {
  slug: "portfolio",
  title: "Portfolio Full-Stack",
  description: "Next.js + Spring Boot, architecture découplée.",
  stack: ["Next.js", "Spring Boot"],
  repoUrl: "https://github.com/florianparret/portfolio",
  demoUrl: "https://example.com",
};

describe("Project detail page", () => {
  it("affiche le titre, la description, la stack et les liens repo/démo", async () => {
    fetchProjectMock.mockResolvedValue(mockProject);

    const element = await ProjectDetailPage({
      params: Promise.resolve({ slug: "portfolio" }),
    });
    render(element);

    expect(
      screen.getByRole("heading", { level: 1, name: mockProject.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(mockProject.description)).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "← Retour aux projets" })).toHaveAttribute(
      "href",
      "/projects",
    );
    expect(screen.getByRole("link", { name: /Voir le code/ })).toHaveAttribute(
      "href",
      mockProject.repoUrl,
    );
    expect(screen.getByRole("link", { name: /Voir la démo/ })).toHaveAttribute(
      "href",
      mockProject.demoUrl,
    );
  });

  it("n'affiche pas les liens repo/démo quand ils sont absents", async () => {
    fetchProjectMock.mockResolvedValue({ ...mockProject, repoUrl: undefined, demoUrl: undefined });

    const element = await ProjectDetailPage({
      params: Promise.resolve({ slug: "portfolio" }),
    });
    render(element);

    expect(screen.queryByRole("link", { name: /Voir le code/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Voir la démo/ })).not.toBeInTheDocument();
  });

  it("déclenche notFound() si le slug n'existe pas", async () => {
    fetchProjectMock.mockResolvedValue(null);

    await expect(
      ProjectDetailPage({ params: Promise.resolve({ slug: "does-not-exist" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("generateMetadata renvoie le titre du projet", async () => {
    fetchProjectMock.mockResolvedValue(mockProject);

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "portfolio" }),
    });

    expect(metadata.title).toBe(`${mockProject.title} — Portfolio`);
  });

  it("generateMetadata retombe sur un titre générique si le projet n'existe pas", async () => {
    fetchProjectMock.mockResolvedValue(null);

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "does-not-exist" }),
    });

    expect(metadata.title).toBe("Projet introuvable");
  });
});
