import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AdminPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

const fetchProjectsMock = vi.fn();

vi.mock("@/lib/api", () => ({
  logout: vi.fn(),
  deleteProject: vi.fn(),
  fetchProjects: () => fetchProjectsMock(),
}));

const mockProjects = [
  {
    slug: "portfolio",
    title: "Portfolio",
    description: "desc",
    stack: ["Next.js"],
  },
];

describe("Admin page", () => {
  it("affiche le titre, le bouton de déconnexion et le lien de création", async () => {
    fetchProjectsMock.mockResolvedValue({ success: true, projects: [] });

    render(await AdminPage());

    expect(
      screen.getByRole("heading", { level: 1, name: "Espace admin" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Se déconnecter" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Nouveau projet" }),
    ).toHaveAttribute("href", "/admin/projects/new");
  });

  it("affiche une carte par projet avec les actions modifier/supprimer", async () => {
    fetchProjectsMock.mockResolvedValue({ success: true, projects: mockProjects });

    render(await AdminPage());

    expect(screen.getByText("Portfolio")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Modifier" })).toHaveAttribute(
      "href",
      "/admin/projects/portfolio/edit",
    );
    expect(screen.getByRole("button", { name: "Supprimer" })).toBeInTheDocument();
  });

  it("affiche un message quand la liste est vide", async () => {
    fetchProjectsMock.mockResolvedValue({ success: true, projects: [] });

    render(await AdminPage());

    expect(screen.getByText("Aucun projet pour le moment.")).toBeInTheDocument();
  });

  it("affiche un message d'erreur si l'API est indisponible", async () => {
    fetchProjectsMock.mockResolvedValue({ success: false });

    render(await AdminPage());

    expect(
      screen.getByText("Impossible de charger les projets pour le moment."),
    ).toBeInTheDocument();
  });
});
