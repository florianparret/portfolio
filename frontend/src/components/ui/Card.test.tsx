import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("affiche son contenu, avec ou sans interactive", () => {
    render(<Card>Contenu de la carte</Card>);
    expect(screen.getByText("Contenu de la carte")).toBeInTheDocument();
  });

  it("accepte la prop interactive sans casser le rendu", () => {
    render(<Card interactive>Carte cliquable</Card>);
    expect(screen.getByText("Carte cliquable")).toBeInTheDocument();
  });
});
