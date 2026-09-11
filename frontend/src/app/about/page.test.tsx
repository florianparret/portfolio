import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage from "./page";
import { aboutContent } from "@/lib/mock-data";

describe("About page", () => {
  it("affiche le titre et les paragraphes de présentation", () => {
    render(<AboutPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: aboutContent.heading }),
    ).toBeInTheDocument();

    for (const paragraph of aboutContent.paragraphs) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
  });
});
