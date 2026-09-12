import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ContactPage from "./page";

const submitContactMessageMock = vi.fn();

vi.mock("@/lib/api", () => ({
  submitContactMessage: (...args: unknown[]) => submitContactMessageMock(...args),
}));

describe("Contact page", () => {
  beforeEach(() => {
    submitContactMessageMock.mockReset();
  });

  it("inclut un champ honeypot invisible et non focusable", () => {
    render(<ContactPage />);

    const honeypot = screen.getByLabelText("Site web");
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot.closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("affiche des erreurs de validation quand le formulaire est vide", async () => {
    render(<ContactPage />);

    fireEvent.click(screen.getByRole("button", { name: "Envoyer" }));

    await waitFor(() => expect(screen.getByText("Le nom est requis.")).toBeInTheDocument());
    expect(screen.getByText("L'email est requis.")).toBeInTheDocument();
    expect(screen.getByText("Le message est requis.")).toBeInTheDocument();
    expect(submitContactMessageMock).not.toHaveBeenCalled();
  });

  it("affiche une erreur d'email invalide", async () => {
    render(<ContactPage />);

    fireEvent.change(screen.getByLabelText("Nom"), { target: { value: "Jane Doe" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "not-an-email" } });
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Bonjour." } });
    fireEvent.click(screen.getByRole("button", { name: "Envoyer" }));

    await waitFor(() =>
      expect(screen.getByText("Adresse email invalide.")).toBeInTheDocument(),
    );
    expect(submitContactMessageMock).not.toHaveBeenCalled();
  });

  it("envoie le formulaire et affiche un message de succès", async () => {
    submitContactMessageMock.mockResolvedValue(true);
    render(<ContactPage />);

    fireEvent.change(screen.getByLabelText("Nom"), { target: { value: "Jane Doe" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jane@example.com" } });
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "Bonjour, votre profil m'intéresse." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Envoyer" }));

    await waitFor(() =>
      expect(screen.getByText("Message envoyé, merci !")).toBeInTheDocument(),
    );
    expect(submitContactMessageMock).toHaveBeenCalledWith({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Bonjour, votre profil m'intéresse.",
      website: "",
    });
  });

  it("affiche un message d'erreur si l'envoi échoue", async () => {
    submitContactMessageMock.mockResolvedValue(false);
    render(<ContactPage />);

    fireEvent.change(screen.getByLabelText("Nom"), { target: { value: "Jane Doe" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jane@example.com" } });
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Bonjour." } });
    fireEvent.click(screen.getByRole("button", { name: "Envoyer" }));

    await waitFor(() =>
      expect(
        screen.getByText(
          "Impossible d'envoyer le message pour le moment. Réessaie plus tard.",
        ),
      ).toBeInTheDocument(),
    );
  });
});
