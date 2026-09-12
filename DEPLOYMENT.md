# Déploiement

Ce document décrit l'architecture de déploiement du portfolio, les variables d'environnement
nécessaires, la procédure de mise en production, et les incidents rencontrés (utile pour
comprendre *pourquoi* certains réglages existent, pas seulement *quoi* configurer).

## 1. Vue d'ensemble

Le frontend et le backend sont déployés séparément, sur deux plateformes différentes, comme deux
applications indépendantes qui communiquent en HTTP :

```
┌──────────────┐        HTTPS / JSON         ┌───────────────┐        JDBC        ┌────────────┐
│   Vercel      │ ───────────────────────────▶│   Render       │───────────────────▶│  Render     │
│  (frontend)   │◀─────────────────────────── │  (backend)     │◀────────────────── │  Postgres   │
│  Next.js SSR  │      cookie cross-domain     │  Spring Boot   │                    │  managé     │
└──────────────┘                              └───────────────┘                    └────────────┘
```

- **Frontend** — `https://portfolio-flo-parret.vercel.app` (Vercel, déploiement automatique sur
  push vers `main`, root directory `frontend/`).
- **Backend** — `https://portfolio-c0o2.onrender.com` (Render Web Service, Docker, déploiement
  automatique sur push vers `main`, root directory `backend/`).
- **Base de données** — PostgreSQL managé par Render, dans la même région que le Web Service.

Pourquoi deux hébergeurs plutôt qu'un seul : Vercel ne fait tourner que des fonctions serverless
et des sites statiques/SSR Next.js — pas un process JVM long-vivant comme Spring Boot. Voir
`DECISIONS.md` pour le détail des alternatives (Railway, Fly.io) et pourquoi Render a été retenu.

## 2. Comment le déploiement est déclenché

Il n'y a pas d'étape manuelle : chaque push sur `main` déclenche, en parallèle et indépendamment
l'un de l'autre :

1. **GitHub Actions** (`backend-ci.yml` / `frontend-ci.yml`, filtrés par dossier) — exécute la
   suite de tests. Ce n'est **pas** un gate qui bloque le déploiement (Render/Vercel ne savent pas
   attendre le résultat de la CI GitHub), c'est une vérification a posteriori. Le vrai gate, c'est
   la discipline de ne jamais merger sur `main` sans avoir vérifié la CI sur `dev` d'abord (voir
   `CONTRIBUTING.md`).
2. **Render** — reconstruit l'image Docker (`backend/Dockerfile`) et redéploie le Web Service.
3. **Vercel** — relance `next build` sur `frontend/` et redéploie.

Un push sur une autre branche que `main` déclenche uniquement la CI GitHub (pas de déploiement).

## 3. Variables d'environnement

### Backend (Render → Web Service → Environment)

| Variable | Exemple / format | Secret ? | Rôle |
|---|---|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://<host>:<port>/<db>` | non | Connexion à la base Render (champs séparés, pas l'URL combinée `postgresql://user:pass@host/db` affichée en premier par Render — voir §5) |
| `SPRING_DATASOURCE_USERNAME` | fourni par Render | non | — |
| `SPRING_DATASOURCE_PASSWORD` | fourni par Render | **oui** | — |
| `JWT_SECRET` | chaîne aléatoire ≥ 32 caractères | **oui** | Signature HMAC-SHA256 des JWT ([JwtService.java](backend/src/main/java/com/florianparret/portfolio/auth/JwtService.java)) |
| `ADMIN_USERNAME` | ex. `admin` | non | Identifiant du compte admin unique |
| `ADMIN_PASSWORD_HASH` | hash bcrypt (`$2a$10$...`) | **oui** | Jamais le mot de passe en clair — voir §6 pour le générer |
| `CORS_ALLOWED_ORIGIN` | `https://portfolio-flo-parret.vercel.app` | non | Origine unique autorisée en CORS — **doit correspondre exactement** au domaine frontend réellement utilisé (voir incident §7.3) |
| `MAIL_USERNAME` | `flo.parret@gmail.com` | non | Compte SMTP Gmail utilisé pour l'envoi |
| `MAIL_PASSWORD` | mot de passe d'application Gmail (16 caractères) | **oui** | Jamais le mot de passe principal du compte Google |
| `CONTACT_NOTIFICATION_EMAIL` | `flo.parret@gmail.com` | non | Destinataire des notifications du formulaire de contact |

### Frontend (Vercel → Settings → Environment Variables)

| Variable | Exemple | Type Vercel | Rôle |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | `https://portfolio-c0o2.onrender.com` | **Config** (pas Sensitive) | Base URL de l'API, appelée aussi bien depuis des Server Components que des Client Components — voir incident §7.4 |

## 4. Procédure de premier déploiement (référence)

Cette section documente la procédure suivie pour ce projet — utile pour la reproduire sur un
futur projet, ou pour un nouvel environnement (staging, etc.).

**Backend (Render)** :
1. Créer une base **PostgreSQL** managée sur Render.
2. Créer un **Web Service** pointant sur le repo GitHub, root directory `backend`, environnement
   **Docker** (détecte automatiquement `backend/Dockerfile`).
3. Renseigner les variables d'environnement (§3), en construisant `SPRING_DATASOURCE_URL` à
   partir des champs séparés fournis par Render (Hostname/Port/Database), pas de l'URL combinée.
4. Déployer, vérifier `GET /actuator/health` → `{"status":"UP"}`.

**Frontend (Vercel)** :
1. Importer le repo GitHub, **Root Directory** = `frontend`.
2. Vérifier que **Framework Preset** = `Next.js` (pas `Other` — voir incident §7.2).
3. Renseigner `NEXT_PUBLIC_API_URL` en type **Config**.
4. Déployer.

**Boucler la config** :
1. Une fois l'URL Vercel connue, mettre à jour `CORS_ALLOWED_ORIGIN` sur Render avec cette URL
   exacte.
2. Tester le parcours complet : pages publiques → login admin → création d'un projet → affichage
   public → logout.

## 5. Base de données : piège du format de connexion

Render affiche en premier une **Internal Database URL** au format
`postgresql://user:password@host/dbname` — ce n'est **pas** directement utilisable dans
`SPRING_DATASOURCE_URL`, qui attend un préfixe `jdbc:` et des identifiants séparés. Utiliser les
champs individuels (Hostname, Port, Database, Username, Password) affichés juste en dessous pour
construire `jdbc:postgresql://<Hostname>:<Port>/<Database>`, `SPRING_DATASOURCE_USERNAME` et
`SPRING_DATASOURCE_PASSWORD` séparément.

## 6. Générer les secrets en local (jamais dans le repo, jamais dans un chat)

**`JWT_SECRET`** — n'importe quelle chaîne aléatoire ≥ 32 caractères :
```bash
openssl rand -base64 32
```

**`ADMIN_PASSWORD_HASH`** — hash bcrypt généré via la dépendance déjà présente dans le projet
(`spring-security-crypto`), sans dépendance supplémentaire :
```bash
jshell --class-path "<chemin-vers-.m2>/org/springframework/security/spring-security-crypto/7.1.1/spring-security-crypto-7.1.1.jar;<chemin-vers-.m2>/org/springframework/spring-jcl/6.2.12/spring-jcl-6.2.12.jar"
```
```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
new BCryptPasswordEncoder().encode("le_mot_de_passe_choisi")
```
`spring-jcl` est nécessaire sur le classpath (dépendance transitive de `spring-security-crypto`
pour le logging) — sans lui, `NoClassDefFoundError: org/apache/commons/logging/LogFactory`.

**`MAIL_PASSWORD`** — mot de passe d'application Gmail (nécessite la validation en deux étapes
activée sur le compte) : [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).

Dans les trois cas : générer en local, coller directement dans les variables d'environnement de
la plateforme d'hébergement, jamais dans un message ou un fichier committé.

## 7. Incidents rencontrés en déployant (et pourquoi les réglages actuels existent)

### 7.1 — `npm ci` échoue en CI mais pas en local

Le `package-lock.json` généré sous Windows omet des dépendances optionnelles spécifiques à Linux
(`@emnapi/*`, utilisées par les bindings natifs de Tailwind v4). `npm ci` sur les runners Linux de
GitHub Actions échouait alors que tout fonctionnait en local. **Fix** : régénérer le lockfile
depuis un conteneur Linux avant de pousser :
```bash
docker run --rm -v "$PWD/frontend:/app" -w /app node:24 sh -c "npm install"
```
**Leçon retenue** : après tout `npm install` qui touche `package-lock.json`, le régénérer depuis
Linux avant de pousser plutôt que de le découvrir sur GitHub Actions.

### 7.2 — Le frontend renvoie 404 sur toutes les routes malgré un build "Ready"

Le **Framework Preset** du projet Vercel était réglé sur `Other` (probablement un choix par
défaut lors de la création du projet, avant que le Root Directory ne soit pointé sur `frontend`).
Avec ce preset, Vercel traite le projet comme un site statique générique et ignore complètement le
routing serveur de Next.js — d'où un 404 plateforme (`X-Vercel-Error: NOT_FOUND`) sur `/` et
toutes les autres routes, alors même que le build lui-même réussissait. **Fix** : Settings →
General → Build and Development Settings → Framework Preset → `Next.js`, puis redéployer (un
changement de Project Settings ne s'applique pas rétroactivement à un déploiement déjà construit).

Un piège adjacent rencontré au même moment : **Deployment Protection** réglé sur "Standard
Protection" exige une session Vercel authentifiée pour voir *tous* les déploiements, y compris la
production — ce qui aurait bloqué n'importe quel visiteur externe (un recruteur, par exemple).
Réglé sur `Disabled` dans Settings → Deployment Protection.

### 7.3 — Boucle infinie de redirection après un login réussi en prod

Après un login réussi (200, cookie posé), la navigation vers `/admin` renvoyait systématiquement
vers `/admin/login`. Cause structurelle : le middleware Vercel (`proxy.ts`, désormais supprimé)
vérifiait la présence du cookie `auth_token` sur la requête *vers le frontend* — mais ce cookie
est posé par le *backend* et, sans attribut `Domain` explicite, un cookie ne traverse jamais les
hosts. En local ça fonctionnait par accident : `localhost:3000` et `localhost:8080` partagent le
même host (`localhost`), donc le cookie était visible des deux côtés malgré le port différent ; en
cross-domain réel (Vercel ≠ Render), ce n'est structurellement plus possible.

**Fix** : voir `DECISIONS.md` D6 — vérification de session déplacée côté client (`AdminGuard`),
qui appelle directement le backend (qui, lui, reçoit bien le cookie).

Un détail annexe du même épisode : deux domaines Vercel actifs
(`portfolio-theta-three-48.vercel.app` et `portfolio-flo-parret.vercel.app`) pointaient vers le
même déploiement, mais `CORS_ALLOWED_ORIGIN` côté backend n'en autorisait qu'un seul — l'autre
domaine affichait le site mais toute requête vers l'API échouait en CORS (403 au preflight). Un
seul domaine est conservé comme URL officielle (`portfolio-flo-parret.vercel.app`), en cohérence
avec le CORS.

### 7.4 — Impossible de sauvegarder `NEXT_PUBLIC_API_URL` sur Vercel

En créant la variable, Vercel proposait par défaut le type **Secret** (write-only, jamais relisible
depuis l'UI). Or `NEXT_PUBLIC_*` est de toute façon inlinée dans le bundle JS envoyé au navigateur
— la marquer "Secret" ne protège rien et Vercel refuse ensuite de la reconvertir en **Config**
("Saved secrets are write-only, so this variable can't be changed to Config"). **Fix** : supprimer
la variable et la recréer directement en type Config.

### 7.5 — `/actuator/health` passe à DOWN après l'ajout de `spring-boot-starter-mail`

Découvert en testant localement avec des identifiants SMTP placeholder avant même de toucher à
Render : Spring Boot Actuator ajoute automatiquement un contrôle de connectivité SMTP à
`/actuator/health` dès que `spring-boot-starter-mail` est sur le classpath. Avec des identifiants
invalides ou non configurés, ce contrôle échoue et fait passer *toute* la santé de l'application à
DOWN — alors que l'envoi d'email n'est qu'un effet de bord non-critique du formulaire de contact.
Une plateforme d'hébergement qui surveille `/actuator/health` pourrait en conclure, à tort, que
toute l'API est en panne. **Fix** : `management.health.mail.enabled: false` dans
`application.yml`.

## 8. Limites connues (tier gratuit)

- **Cold start Render** : le Web Service gratuit se met en veille après une période
  d'inactivité ; la première requête après veille peut prendre 30-60 secondes.
- **Rate limiting du formulaire de contact en mémoire** : l'état (tentatives par IP) est perdu à
  chaque redémarrage de l'instance Render (déploiement, réveil après veille). Acceptable pour le
  trafic attendu d'un portfolio personnel ; passerait par un store partagé (Redis) si le trafic
  devenait significatif.
- **Deux domaines Vercel actifs** mais un seul autorisé en CORS (voir §7.3) — ne jamais partager
  `portfolio-theta-three-48.vercel.app`, seulement `portfolio-flo-parret.vercel.app`.
