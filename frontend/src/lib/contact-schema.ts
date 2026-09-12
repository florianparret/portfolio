import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis."),
  email: z.string().trim().min(1, "L'email est requis.").email("Adresse email invalide."),
  message: z
    .string()
    .trim()
    .min(1, "Le message est requis.")
    .max(2000, "Le message est limité à 2000 caractères."),
  // Honeypot anti-spam : champ invisible pour un visiteur humain, que seul un bot remplirait.
  website: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
