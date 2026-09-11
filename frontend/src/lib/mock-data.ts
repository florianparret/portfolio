import type { Project } from "@/types/project";

export const profile = {
  title: "Développeur Full-Stack Java / React",
  intro:
    "Portfolio personnel construit comme une vraie application full-stack : Next.js côté frontend, Spring Boot et PostgreSQL côté backend.",
};

export const aboutContent = {
  heading: "À propos",
  paragraphs: [
    "Développeur en apprentissage actif, je construis ce portfolio comme mon premier projet full-stack démontrable, avec l'objectif de comprendre et savoir expliquer chaque choix technique.",
    "Stack principale : Next.js (TypeScript, Tailwind) côté frontend, Spring Boot (Java 21, PostgreSQL, Flyway) côté backend.",
  ],
};

export const projects: Project[] = [
  {
    slug: "portfolio",
    title: "Portfolio Full-Stack",
    description:
      "Ce portfolio lui-même : Next.js + Spring Boot, architecture découplée, authentification JWT pour la partie admin.",
    stack: ["Next.js", "TypeScript", "Spring Boot", "PostgreSQL"],
  },
  {
    slug: "suivi-candidatures",
    title: "Suivi de candidatures (à venir)",
    description:
      "Application de suivi de candidatures, pensée comme prochaine brique ajoutée à ce portfolio.",
    stack: ["Next.js", "Spring Boot"],
  },
];
