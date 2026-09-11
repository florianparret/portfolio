import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import EditProjectPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

const fetchProjectMock = vi.fn();

vi.mock("@/lib/api", () => ({
  fetchProject: (slug: string) => fetchProjectMock(slug),
  updateProject: vi.fn(),
}));

describe("Edit project page", () => {
  it("pré-remplit le formulaire avec le projet existant", async () => {
    fetchProjectMock.mockResolvedValue({
      slug: "portfolio",
      title: "Portfolio",
      description: "desc",
      stack: ["Next.js"],
    });

    const element = await EditProjectPage({
      params: Promise.resolve({ slug: "portfolio" }),
    });
    render(element);

    expect(
      screen.getByRole("heading", { level: 1, name: "Modifier « Portfolio »" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Slug")).toBeDisabled();
    expect(screen.getByLabelText("Titre")).toHaveValue("Portfolio");
  });

  it("déclenche notFound() si le slug n'existe pas", async () => {
    fetchProjectMock.mockResolvedValue(null);

    await expect(
      EditProjectPage({ params: Promise.resolve({ slug: "does-not-exist" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
