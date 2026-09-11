import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DeleteProjectButton } from "./DeleteProjectButton";

const refreshMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: refreshMock }),
}));

const deleteProjectMock = vi.fn();

vi.mock("@/lib/api", () => ({
  deleteProject: (slug: string) => deleteProjectMock(slug),
}));

describe("DeleteProjectButton", () => {
  beforeEach(() => {
    refreshMock.mockReset();
    deleteProjectMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("supprime le projet et rafraîchit la liste si l'utilisateur confirme", async () => {
    vi.stubGlobal("confirm", vi.fn().mockReturnValue(true));
    deleteProjectMock.mockResolvedValue(true);
    render(<DeleteProjectButton slug="portfolio" />);

    fireEvent.click(screen.getByRole("button", { name: "Supprimer" }));

    await waitFor(() => expect(deleteProjectMock).toHaveBeenCalledWith("portfolio"));
    expect(refreshMock).toHaveBeenCalled();
  });

  it("ne fait rien si l'utilisateur annule la confirmation", async () => {
    vi.stubGlobal("confirm", vi.fn().mockReturnValue(false));
    render(<DeleteProjectButton slug="portfolio" />);

    fireEvent.click(screen.getByRole("button", { name: "Supprimer" }));

    await waitFor(() => expect(deleteProjectMock).not.toHaveBeenCalled());
    expect(refreshMock).not.toHaveBeenCalled();
  });
});
