# Guide de contribution

Ce projet est développé en solo avec l'aide de Claude Code, dans le cadre défini par `CLAUDE.md`.
Ce document décrit le workflow Git et les conventions à suivre.

## Branches

- `main` — branche de production. Toujours stable, déployable.
- `dev` — branche d'intégration. Les fonctionnalités validées y sont fusionnées avant d'être
  éventuellement passées sur `main`.
- `feature/<nom>` — une branche par ticket ou fonctionnalité, créée depuis `dev`.
  Exemple : `feature/frontend-init`.
- `fix/<nom>` — pour un correctif ciblé, même logique que `feature/*`.

## Workflow

1. Créer une branche depuis `dev` : `git checkout -b feature/<nom> dev`.
2. Implémenter **une seule tâche à la fois** (voir `CLAUDE.md`), avec les tests associés dans le
   même lot de commits.
3. Ouvrir une Pull Request vers `dev`. Relire le diff avant de fusionner.
4. Une fois `dev` stabilisée sur un ensemble cohérent de fonctionnalités, fusionner `dev` dans
   `main` pour une mise en production.

## Commits

Format [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` — nouvelle fonctionnalité
- `fix:` — correction de bug
- `test:` — ajout ou modification de tests
- `docs:` — documentation
- `chore:` — tâches diverses (config, dépendances, etc.)
- `refactor:` — changement de code sans impact fonctionnel

Exemple : `feat: ajoute l'entité Project et la migration Flyway associée`

## Pull Requests

- Une PR correspond à une seule tâche ou un seul ticket du backlog.
- Décrire brièvement le "pourquoi" du changement, pas seulement le "quoi".
- Les tests doivent passer avant la fusion (`mvn test` / `mvn verify` côté backend,
  `npm run test` / `npm run test:e2e` côté frontend).

## Revue

Le développeur relit systématiquement le diff (`git diff`) avant de committer et avant de
fusionner une PR. En cas de problème, revenir en arrière (`git checkout -- .`, `git reset`)
plutôt que de laisser corriger par-dessus un résultat déjà bancal.
