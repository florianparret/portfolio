import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AdminPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/lib/api", () => ({
  logout: vi.fn(),
}));

describe("Admin page", () => {
  it("affiche le titre et le bouton de déconnexion", () => {
    render(<AdminPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Espace admin" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Se déconnecter" }),
    ).toBeInTheDocument();
  });
});
