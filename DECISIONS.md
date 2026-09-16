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

## D5 — Cookie `SameSite=None` plutôt que `Strict` pour l'auth cross-domain

**Contexte** : frontend (Vercel) et backend (Render) déployés sur deux domaines distincts. Le
cookie JWT était en `SameSite=Strict`, qui empêche le navigateur de l'envoyer sur toute requête
cross-site — y compris les appels `fetch` légitimes du frontend vers l'API.
**Alternative envisagée** : proxy Next.js (`rewrites()` dans `next.config.ts`) pour que le
navigateur ne parle qu'à un seul domaine, gardant `Strict`. Plus robuste mais ajoute une brique
d'infra (le frontend relaie chaque appel API) pour un projet solo à faible trafic.
**Décision** : `SameSite=None` + `Secure` (déjà en place). La protection CSRF ne repose plus sur
`SameSite` mais sur le CORS existant : origine unique explicite (pas de wildcard), `credentials`
activés, et `allowedHeaders` restreint à `Content-Type` — ce qui force un preflight sur toute
requête JSON cross-site, qu'un navigateur bloque si l'origine ne correspond pas exactement.
**Conséquences** : fonctionne en cross-domain réel ; `CORS_ALLOWED_ORIGIN` doit rester
scrupuleusement synchronisé avec le domaine frontend réel (un domaine Vercel alternatif non listé
casse silencieusement le login, cf. `DEPLOYMENT.md` §7.3).

## D6 — Vérification de session admin côté client plutôt que middleware Vercel

**Contexte** : le middleware Vercel (`proxy.ts`) protégeait `/admin/*` en vérifiant la présence du
cookie `auth_token` sur la requête entrante. Ce cookie est posé par le backend et scopé à son seul
host (Render) : l'edge Vercel ne peut structurellement jamais le voir en cross-domain (ça
fonctionnait en local seulement parce que `localhost:3000`/`:8080` partagent le même host).
**Alternative envisagée** : le proxy Next.js évoqué en D5 aurait aussi réglé ce problème (tout
redevient same-origin), au prix de la même complexité d'infra supplémentaire.
**Décision** : suppression de `proxy.ts` ; ajout d'un endpoint `GET /api/auth/session`
(authentifié, 401 sinon) et d'un composant client `AdminGuard` qui l'appelle directement au
chargement des pages admin, redirigeant vers `/admin/login` en cas de 401.
**Conséquences** : la vraie frontière de sécurité (les mutations `POST/PUT/DELETE /api/projects`
exigent déjà une authentification côté backend) n'a jamais été affectée par ce bug — seul le
redirect de confort l'était. Limite connue et acceptée : le contenu des pages admin passe par le
rendu serveur avant que le garde-fou client ne s'applique, mais ces pages n'affichent que des
données déjà publiques (la liste des projets, identique à `/projects`), donc sans impact réel.

## D7 — Formulaire de contact : envoi d'email via Resend + rate limiting + honeypot

**Contexte** : `POST /api/contact` est un endpoint public non authentifié. Avant d'y brancher un
envoi d'email vers une boîte personnelle, deux risques réels à couvrir : le spam de la boîte mail
(coût quasi nul pour un bot, gênant en pratique) et l'épuisement d'un quota d'envoi.
**Alternative envisagée initialement** : `spring-boot-starter-mail` en SMTP direct vers Gmail —
choisi en premier car officiellement supporté par Spring, sans nouveau compte externe. Écarté après
coup : Render bloque les ports SMTP sortants (25/465/587) sur son tier gratuit, une mesure
anti-spam courante chez les hébergeurs PaaS — les emails ne partaient jamais, même avec des
identifiants corrects (voir `DEPLOYMENT.md` §7.6 pour le diagnostic complet). Aucun réglage
applicatif ne peut contourner un blocage réseau de la plateforme d'hébergement.
**Décision** : API HTTPS de [Resend](https://resend.com) (port 443, jamais bloqué), appelée via
`RestClient` — déjà présent dans l'écosystème Spring (module `spring-boot-restclient`), donc zéro
nouvelle dépendance de bibliothèque ; seulement un nouveau compte externe et une clé API, le prix à
payer pour sortir du réseau de la plateforme d'hébergement. Envoi asynchrone et best-effort (un
échec API est loggé, jamais renvoyé au visiteur — le message est de toute façon déjà persisté).
CAPTCHA (Turnstile/hCaptcha) écarté pour l'instant : efficace mais dépendance tierce et friction
supplémentaire pour un formulaire de contact personnel à faible trafic — à reconsidérer si le spam
devient un problème réel. Deux mitigations anti-spam sans dépendance externe : un champ honeypot
(`ContactRequest.website`, invisible pour un humain, silencieusement ignoré s'il est rempli) et un
rate limiter en mémoire par IP (5 tentatives/heure).
**Conséquences** : `server.forward-headers-strategy=framework` nécessaire pour que le rate
limiter voie la vraie IP du visiteur derrière le proxy Render, sinon tout le monde partagerait la
même IP apparente. Spring Boot 4 a extrait l'auto-configuration de `RestClient` dans un module
séparé (`spring-boot-restclient`), à ajouter explicitement — sans quoi l'application refuse de
démarrer en production alors qu'un test peut accidentellement passer si le module est présent
transitivement côté test (cf. `DEPLOYMENT.md` §7.7). Limite acceptée : l'état du rate limiter est
perdu à chaque redémarrage de l'instance (tier gratuit Render) — non bloquant pour ce niveau de
trafic, migrerait vers un store partagé sinon.

---

_Ce fichier est complété au fil des phases, à chaque décision technique qui mérite d'être
justifiée en entretien._
