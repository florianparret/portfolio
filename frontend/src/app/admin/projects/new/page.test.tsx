import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NewProjectPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/lib/api", () => ({
  createProject: vi.fn(),
}));

describe("New project page", () => {
  it("affiche le titre et le formulaire en mode création", () => {
    render(<NewProjectPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Nouveau projet" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Slug")).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Créer" })).toBeInTheDocument();
  });
});
