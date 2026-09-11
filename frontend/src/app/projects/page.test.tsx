import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProjectsPage from "./page";
import { projects } from "@/lib/mock-data";

describe("Projects page", () => {
  it("affiche un titre et une carte par projet mocké", () => {
    render(<ProjectsPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Projets" }),
    ).toBeInTheDocument();

    for (const project of projects) {
      expect(
        screen.getByRole("heading", { level: 2, name: project.title }),
      ).toBeInTheDocument();
      expect(screen.getByText(project.description)).toBeInTheDocument();
    }
  });
});
