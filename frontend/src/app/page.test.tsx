import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";
import { profile } from "@/lib/mock-data";

describe("Home page", () => {
  it("affiche le titre et l'intro du profil", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: profile.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(profile.intro)).toBeInTheDocument();
  });

  it("propose un lien vers la page des projets", () => {
    render(<Home />);

    const link = screen.getByRole("link", { name: "Voir mes projets" });
    expect(link).toHaveAttribute("href", "/projects");
  });
});
