# Portfolio Full-Stack — Java / React

[![Backend CI](https://github.com/florianparret/portfolio/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/florianparret/portfolio/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/florianparret/portfolio/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/florianparret/portfolio/actions/workflows/frontend-ci.yml)

## 1. Présentation

Portfolio personnel et premier projet démontrable, construit comme une vraie application full-stack
(pas un site statique). Il présente mon profil, mon parcours et mes projets, et sert de socle pour
en ajouter d'autres au fil du temps (ex. application de suivi de candidatures).

- Démo : [portfolio-flo-parret.vercel.app](https://portfolio-flo-parret.vercel.app)
- Contexte, objectifs et choix techniques détaillés : voir la
  [page projet correspondante](https://portfolio-flo-parret.vercel.app/projects/portfolio), et
  `DECISIONS.md` pour le détail des arbitrages techniques.

## 2. Stack technique

**Frontend** — Next.js (App Router), TypeScript (strict), React, Tailwind CSS, React Hook Form, Zod,
Vitest + Testing Library, Playwright (vérifications ponctuelles).

**Backend** — Java 21, Spring Boot (Web, Data JPA, Security, RestClient), PostgreSQL, Flyway, JJWT,
JUnit, Testcontainers, springdoc-openapi.

**DevOps** — Docker, Docker Compose (dev local), GitHub Actions.

## 3. Architecture

Monolithe modulaire côté backend (package-by-feature), API REST claire, frontend et backend
séparés et déployés indépendamment.

```
[ Next.js frontend ]  <—— REST/JSON ——>  [ Spring Boot backend ]  <——>  [ PostgreSQL ]
```

Détail complet : voir le plan de projet (section Architecture technique) et `DECISIONS.md`.

## 4. Installation

Prérequis :
- Node.js 20+
- Java 21
- Docker et Docker Compose

```bash
git clone <url-du-repo>
cd portfolio
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

## 5. Variables d'environnement

| Variable | Emplacement | Description |
|---|---|---|
| `SPRING_DATASOURCE_URL` | backend | URL de connexion PostgreSQL |
| `SPRING_DATASOURCE_USERNAME` | backend | Utilisateur PostgreSQL |
| `SPRING_DATASOURCE_PASSWORD` | backend | Mot de passe PostgreSQL |
| `JWT_SECRET` | backend | Clé de signature des tokens JWT (dev uniquement, secret réel en prod) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` | backend | Identifiants du compte admin unique (hash bcrypt) |
| `CORS_ALLOWED_ORIGIN` | backend | Origine autorisée pour les appels cross-origin du frontend |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | backend | Envoi des notifications du formulaire de contact via l'API Resend |
| `CONTACT_NOTIFICATION_EMAIL` | backend | Destinataire des notifications du formulaire de contact |
| `NEXT_PUBLIC_API_URL` | frontend | URL de base de l'API backend |

Voir `backend/.env.example` et `frontend/.env.example` pour le détail, et `DEPLOYMENT.md` pour la
configuration en production.

## 6. Lancement local

```bash
docker compose up -d postgres   # base de données
cd backend && mvn spring-boot:run
cd frontend && npm run dev
```

## 7. Tests

- Backend : `mvn test` (unitaires + intégration avec Testcontainers, nécessite Docker)
- Frontend : `npm run test` (Vitest + Testing Library)

## 8. Déploiement

Frontend sur Vercel, backend + PostgreSQL sur Render — déploiement automatique sur push vers
`main`. Détail complet (architecture, variables d'environnement, procédure, incidents rencontrés) :
voir `DEPLOYMENT.md`.

## 9. Décisions techniques

Voir `DECISIONS.md` pour le détail des choix (ex. JWT plutôt que session, monolithe modulaire,
etc.) au format mini-ADR.

## 10. Utilisation de l'IA

Ce projet est développé avec l'aide de Claude Code comme assistant de développement, dans le cadre
défini par `CLAUDE.md` : une tâche à la fois, code expliqué et revu, tests systématiques. Chaque
section importante du code est comprise et validée avant d'être committée.

## 11. Limites connues

Projet personnel, pas destiné à un usage en production à grande échelle — voir `DEPLOYMENT.md`
§8 pour le détail (cold start sur le tier gratuit Render, rate limiting en mémoire, etc.).

## 12. Améliorations futures

- Articles / journal de développement
- Entité Technology normalisée
- Application de suivi de candidatures intégrée au portfolio
- Statistiques admin
