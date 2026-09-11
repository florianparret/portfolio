import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminLoginPage from "./page";

const pushMock = vi.fn();
const refreshMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
}));

const loginMock = vi.fn();

vi.mock("@/lib/api", () => ({
  login: (username: string, password: string) => loginMock(username, password),
}));

describe("Admin login page", () => {
  beforeEach(() => {
    pushMock.mockReset();
    refreshMock.mockReset();
    loginMock.mockReset();
  });

  it("redirige vers /admin après une connexion réussie", async () => {
    loginMock.mockResolvedValue(true);
    render(<AdminLoginPage />);

    fireEvent.change(screen.getByLabelText("Identifiant"), { target: { value: "admin" } });
    fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: "changeme" } });
    fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/admin"));
    expect(loginMock).toHaveBeenCalledWith("admin", "changeme");
  });

  it("affiche un message d'erreur si les identifiants sont invalides", async () => {
    loginMock.mockResolvedValue(false);
    render(<AdminLoginPage />);

    fireEvent.change(screen.getByLabelText("Identifiant"), { target: { value: "admin" } });
    fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));

    await waitFor(() =>
      expect(screen.getByText("Identifiants invalides.")).toBeInTheDocument(),
    );
    expect(pushMock).not.toHaveBeenCalled();
  });
});
