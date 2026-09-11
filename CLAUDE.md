# Instructions pour Claude Code sur ce projet

## Contexte

Portfolio full-stack personnel (mono-repo) :
- `frontend/` — Next.js (App Router) + TypeScript strict + Tailwind
- `backend/` — Spring Boot (Java 21) + PostgreSQL + Flyway

Développeur seul sur le projet, en apprentissage actif. L'objectif n'est pas d'aller vite mais de
comprendre chaque ligne de code produite et de pouvoir l'expliquer en entretien technique.

## Règles impératives

1. **Analyse avant de modifier.** Avant toute proposition de code, analyse la structure existante
   du repo (fichiers, conventions déjà en place). Ne suppose jamais une structure qui n'existe pas
   encore sans le signaler.
2. **Une seule tâche à la fois.** N'implémente qu'un seul ticket du backlog ou une seule
   fonctionnalité à la fois. Ne pars pas sur plusieurs sujets en parallèle dans la même réponse.
3. **Explique avant/après.** Avant une modification importante, résume en 3-4 phrases ce que tu
   vas faire et pourquoi. Après, indique comment vérifier que ça fonctionne (commande à lancer,
   comportement attendu).
4. **Tests systématiques.** Tout code de production ajouté doit s'accompagner des tests
   correspondants (unitaires et/ou intégration selon le cas), dans le même lot de modifications.
5. **Périmètre limité.** Ne modifie que les fichiers strictement nécessaires à la tâche demandée.
   Si une modification annexe te semble utile, signale-la sans l'appliquer directement.
6. **Pas de nouvelle dépendance sans justification.** N'ajoute une bibliothèque que si elle apporte
   une vraie valeur, et explique pourquoi en une phrase.
7. **Conventions du projet.** TypeScript en mode strict. Java 21 avec versions stables des
   dépendances. Backend organisé en package-by-feature (pas de couches génériques transverses type
   DAO/Manager). Commits au format Conventional Commits (`feat:`, `fix:`, `test:`, etc.).
8. **Pas de gros diff surprise.** Si une tâche nécessite de toucher un grand nombre de fichiers,
   préviens-en avant de commencer et propose de découper en sous-étapes.

## Méthode de travail attendue

1. Je donne un ticket ou une tâche précise.
2. Tu résumes ton plan d'implémentation, sans écrire de code, et tu attends ma validation.
3. Une fois validé, tu implémentes uniquement cette tâche, avec les tests associés.
4. Je relis le diff (`git diff`) avant de committer.
5. En cas de problème, je reviens en arrière avec `git checkout -- .` ou `git reset`, plutôt que de
   te laisser corriger par-dessus un résultat déjà bancal.

## Exemples de prompts à privilégier

- « Analyse la structure actuelle du package `project`. Propose un plan pour l'entité Project et la
  migration Flyway correspondant au ticket #4, sans écrire de code. »
- « Écris uniquement les tests d'intégration Testcontainers pour ProjectController, cas 200/401/404,
  sans modifier le code de production. »
- « Explique en 3 phrases pourquoi tu as choisi cette implémentation plutôt qu'une alternative. »
