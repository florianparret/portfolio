import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectForm } from "./ProjectForm";

const pushMock = vi.fn();
const refreshMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
}));

const createProjectMock = vi.fn();
const updateProjectMock = vi.fn();

vi.mock("@/lib/api", () => ({
  createProject: (...args: unknown[]) => createProjectMock(...args),
  updateProject: (...args: unknown[]) => updateProjectMock(...args),
}));

describe("ProjectForm", () => {
  beforeEach(() => {
    pushMock.mockReset();
    refreshMock.mockReset();
    createProjectMock.mockReset();
    updateProjectMock.mockReset();
  });

  it("crée un projet avec la stack découpée sur les virgules", async () => {
    createProjectMock.mockResolvedValue(true);
    render(<ProjectForm mode="create" />);

    fireEvent.change(screen.getByLabelText("Slug"), { target: { value: "portfolio" } });
    fireEvent.change(screen.getByLabelText("Titre"), { target: { value: "Portfolio" } });
    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "desc" } });
    fireEvent.change(screen.getByLabelText("Stack (séparée par des virgules)"), {
      target: { value: "Next.js, Spring Boot ,  PostgreSQL" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Créer" }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/admin"));
    expect(createProjectMock).toHaveBeenCalledWith({
      slug: "portfolio",
      title: "Portfolio",
      description: "desc",
      stack: ["Next.js", "Spring Boot", "PostgreSQL"],
      repoUrl: undefined,
      demoUrl: undefined,
    });
  });

  it("pré-remplit le formulaire en mode édition et empêche de changer le slug", async () => {
    updateProjectMock.mockResolvedValue(true);
    render(
      <ProjectForm
        mode="edit"
        project={{
          slug: "portfolio",
          title: "Portfolio",
          description: "desc",
          stack: ["Next.js", "Spring Boot"],
        }}
      />,
    );

    expect(screen.getByLabelText("Slug")).toBeDisabled();
    expect(screen.getByLabelText("Slug")).toHaveValue("portfolio");
    expect(screen.getByLabelText("Titre")).toHaveValue("Portfolio");

    fireEvent.change(screen.getByLabelText("Titre"), { target: { value: "Portfolio v2" } });
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/admin"));
    expect(updateProjectMock).toHaveBeenCalledWith("portfolio", {
      title: "Portfolio v2",
      description: "desc",
      stack: ["Next.js", "Spring Boot"],
      repoUrl: undefined,
      demoUrl: undefined,
    });
  });

  it("affiche un message d'erreur si l'enregistrement échoue", async () => {
    createProjectMock.mockResolvedValue(false);
    render(<ProjectForm mode="create" />);

    fireEvent.change(screen.getByLabelText("Slug"), { target: { value: "portfolio" } });
    fireEvent.change(screen.getByLabelText("Titre"), { target: { value: "Portfolio" } });
    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "desc" } });
    fireEvent.change(screen.getByLabelText("Stack (séparée par des virgules)"), {
      target: { value: "Next.js" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Créer" }));

    await waitFor(() =>
      expect(
        screen.getByText("Échec de l'enregistrement (slug déjà pris, ou champ invalide)."),
      ).toBeInTheDocument(),
    );
    expect(pushMock).not.toHaveBeenCalled();
  });
});
