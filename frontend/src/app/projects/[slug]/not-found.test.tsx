import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProjectNotFound from "./not-found";

describe("Project not-found page", () => {
  it("affiche un message et un lien de retour vers les projets", () => {
    render(<ProjectNotFound />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Projet introuvable" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Retour aux projets" }),
    ).toHaveAttribute("href", "/projects");
  });
});
