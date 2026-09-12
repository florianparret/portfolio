import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminGuard } from "./AdminGuard";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

const checkSessionMock = vi.fn();

vi.mock("@/lib/api", () => ({
  checkSession: () => checkSessionMock(),
}));

describe("AdminGuard", () => {
  it("affiche le contenu protégé si la session est valide", async () => {
    checkSessionMock.mockResolvedValue(true);

    render(
      <AdminGuard>
        <p>Contenu protégé</p>
      </AdminGuard>,
    );

    expect(await screen.findByText("Contenu protégé")).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("redirige vers /admin/login si la session est invalide", async () => {
    checkSessionMock.mockResolvedValue(false);

    render(
      <AdminGuard>
        <p>Contenu protégé</p>
      </AdminGuard>,
    );

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith("/admin/login"));
    expect(screen.queryByText("Contenu protégé")).not.toBeInTheDocument();
  });
});
