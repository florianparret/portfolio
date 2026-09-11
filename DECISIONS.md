# Décisions techniques

Format court : Décision / Contexte / Alternative(s) envisagée(s) / Conséquences.

## D1 — Mono-repo plutôt que deux repos séparés

**Contexte** : projet solo, frontend et backend évoluent souvent ensemble au début.
**Alternative envisagée** : deux repos séparés (plus proche d'un contexte d'équipe/CI indépendante).
**Décision** : mono-repo avec dossiers `frontend/` et `backend/`.
**Conséquences** : plus simple à gérer seul, un seul historique Git à suivre ; nécessitera des
workflows CI distincts par dossier plus tard.

## D2 — JWT plutôt que session pour l'authentification admin

**Contexte** : un seul compte admin, besoin de protéger des routes de modification.
**Alternative envisagée** : session Spring Security classique (cookie de session côté serveur),
plus simple à mettre en place initialement.
**Décision** : JWT stateless, stocké en cookie httpOnly, expiration courte, pas de refresh token au
MVP.
**Conséquences** : plus de code à écrire au départ (génération/validation du token), mais c'est un
sujet fréquemment abordé en entretien Java/React et plus proche d'un usage réel en architecture
découplée frontend/backend.

## D3 — Monolithe modulaire (package-by-feature) plutôt que microservices

**Contexte** : projet solo, pas de besoin de scalabilité indépendante des modules.
**Décision** : un seul service Spring Boot, organisé par fonctionnalité (`project/`, `auth/`,
`contact/`) plutôt que par couche technique générique.
**Conséquences** : code plus lisible et plus simple à faire évoluer seul ; migration vers des
services séparés resterait possible plus tard si un vrai besoin apparaissait, mais ce n'est pas
l'objectif de ce projet.

## D4 — Palette dark-first avec deux teintes d'accent (clair/sombre)

**Contexte** : refonte du design vers une direction éditoriale sombre premium, avec un accent
citron/lime vif pour se démarquer d'une palette "indigo par défaut". Le mode clair reste supporté
(respect de `prefers-color-scheme`), gratuit en accessibilité.
**Alternative envisagée** : une seule teinte d'accent partagée entre les deux thèmes, plus simple à
maintenir.
**Décision** : deux valeurs distinctes pour `--accent` selon le thème (`#4d6b00` en clair, `#ccff33`
en sombre), choisies après calcul des ratios de contraste WCAG plutôt qu'à l'œil. Le citron vif est
illisible comme texte sur fond clair (~1.1:1) ; seule une variante olive plus foncée passe le seuil
AA (4.5:1) en clair, alors que le citron vif est nécessaire pour un rendu "premium" en sombre (et y
atteint 16.89:1). Mêmes calculs pour `--foreground`/`--muted` (>16:1 et >6:1 dans les deux thèmes).
**Conséquences** : légèrement plus de valeurs à maintenir dans `globals.css`, mais contraste garanti
et vérifiable dans les deux thèmes plutôt que supposé ; le même principe (une valeur par thème)
existait déjà avant cette refonte pour `--accent`, ce n'est pas un nouveau pattern.

---

_Ce fichier est complété au fil des phases, à chaque décision technique qui mérite d'être
justifiée en entretien._
