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

---

_Ce fichier est complété au fil des phases, à chaque décision technique qui mérite d'être
justifiée en entretien._
