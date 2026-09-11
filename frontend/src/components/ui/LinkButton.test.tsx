import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LinkButton } from "./LinkButton";

describe("LinkButton", () => {
  it("rend un lien avec le bon href", () => {
    render(<LinkButton href="/projects">Voir les projets</LinkButton>);

    expect(screen.getByRole("link", { name: "Voir les projets" })).toHaveAttribute(
      "href",
      "/projects",
    );
  });
});
