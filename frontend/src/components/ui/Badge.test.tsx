import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("affiche son contenu", () => {
    render(<Badge>Next.js</Badge>);

    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });
});
