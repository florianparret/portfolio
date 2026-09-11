import { describe, expect, it } from "vitest";
import { contactFormSchema } from "./contact-schema";

describe("contactFormSchema", () => {
  it("accepte des données valides", () => {
    const result = contactFormSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Bonjour, votre profil m'intéresse.",
    });

    expect(result.success).toBe(true);
  });

  it("rejette un nom vide", () => {
    const result = contactFormSchema.safeParse({
      name: "",
      email: "jane@example.com",
      message: "Message de test.",
    });

    expect(result.success).toBe(false);
  });

  it("rejette un email invalide", () => {
    const result = contactFormSchema.safeParse({
      name: "Jane Doe",
      email: "not-an-email",
      message: "Message de test.",
    });

    expect(result.success).toBe(false);
  });

  it("rejette un message vide", () => {
    const result = contactFormSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejette un message de plus de 2000 caractères", () => {
    const result = contactFormSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "a".repeat(2001),
    });

    expect(result.success).toBe(false);
  });
});
