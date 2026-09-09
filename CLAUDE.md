# boilerplate — gabarit d'application front Edifice (React)

Application front **React 18 + TypeScript**, buildée avec **Vite 8**, servie sous le base path `/boilerplate` (vide en dev). Le front vit dans **`frontend/`**.

> Ce repo est un **gabarit** : il est destiné à être **dupliqué** pour démarrer une nouvelle app Edifice (renommer `boilerplate` partout, adapter le base path, etc.), pas à être déployé tel quel. Voir `CHANGELOG.md` pour l'historique des évolutions du gabarit lui-même.

**Backend (contexte, 1 ligne) :** module Java/Vert.x attendu dans `backend/` (Maven, même convention que le reste de l'écosystème ent-core) — **absent de ce gabarit**. Le `Jenkinsfile`, `build.sh` (racine) et `copyFrontFiles.sh` le référencent déjà (`cd backend && ./build.sh ...`, copie de `frontend/dist/*` vers `backend/src/main/resources/`) : à ajouter en premier lors d'un fork, sans quoi le build racine échoue.

## Organisation du repo

```
frontend/            # app React 18 + Vite (le code front, voir ci-dessous)
backend/             # à créer lors d'un fork — module Java/Vert.x (absent ici)
build.sh             # orchestre le build complet (front → copie dans backend → maven)
copyFrontFiles.sh    # copie frontend/dist/* dans backend/src/main/resources/
CHANGELOG.md         # historique des évolutions du gabarit (pas de l'app forkée)
```

> **`CHANGELOG.md` à maintenir** ([Keep a Changelog](https://keepachangelog.com/fr/1.0.0/)) : toute branche qui modifie le gabarit (dépendances, config Vite/ESLint/TS, structure, breaking change) doit ajouter une entrée — ce que ça change, ce qui casse pour un fork existant, comment adapter. C'est la seule trace de l'évolution du gabarit pour les apps qui en dérivent.

## Stack (front)

- **React 18.3** + **TypeScript 6.0** + **Vite 8**
- État : **Zustand** (`src/store/`) — TanStack **React Query** pour l'asynchrone
- Formulaires : **react-hook-form** (déclaré en dépendance, prêt à l'emploi)
- Routing : **React Router 7** (data router, routes lazy)
- i18n : **i18next** + react-i18next (backend HTTP, namespace `boilerplate` + `common` partagé du portail)
- Styles : **`@edifice.io/bootstrap`** (CSS) + composants **`@edifice.io/react`** ; app enveloppée dans `EdificeThemeProvider`/`EdificeClientProvider`
- Client API / helpers : **`@edifice.io/client`**
- Tests : **Vitest 5** + **Testing Library** + **MSW**

> `@edifice.io/bootstrap`, `@edifice.io/client`, `@edifice.io/react` suivent le dist-tag **`develop`** (choix intentionnel de l'écosystème, cf. la norme ENABLING-1099 sur les versions de packages côté `edifice-frontend-framework`) — ne pas les pinner sur une version exacte.

## Commandes (depuis `frontend/`)

Gestionnaire de paquets : **pnpm@9.12.2**. Toujours l'utiliser, ne pas mélanger avec npm/yarn.

| But | Commande |
| --- | --- |
| Dev | `pnpm dev` <!-- vite, port 4200 --> |
| Build | `pnpm build` <!-- typecheck && vite build --> |
| Typecheck | `pnpm typecheck` <!-- tsc -b --noEmit --> |
| Tests | `pnpm test` <!-- vitest --> |
| Tests (couverture) | `pnpm test:coverage` |
| Tests (UI) | `pnpm test:ui` |
| Lint | `pnpm lint` <!-- eslint . --> |
| Format | `pnpm format` <!-- prettier --write . --> |
| Preview | `pnpm preview` <!-- vite preview, port 4300 --> |

> Hooks **Husky + lint-staged** : le pre-commit formate/lint les fichiers modifiés (`**/*.{js,ts,tsx}` → eslint, `**/*` → prettier). Ne pas contourner (`--no-verify`) sans raison.

> `nx` est présent (`nx.json`, `pnpm exec nx test`/`nx build`) : cache local des cibles `build`/`test`/`lint`/`coverage`. Un seul projet ici (pas un vrai monorepo) — son intérêt se limite au cache local, la CI ne le persiste pas entre runs.

## Structure (`frontend/src/`)

```
assets/       components/   config/       features/
hooks/        models/       providers/    routes/
services/     store/        i18n.ts       main.tsx
mocks/        # MSW (setup.ts + handlers.ts, tous deux « DO NOT MODIFY » en tête —
              #  ce sont les fixtures de référence du gabarit)
```

- **`features/<x>/`** — modules fonctionnels (la maille de découpage principale).
- **`routes/`** — React Router 7, routes lazy + `loader`/`errorElement`.
- **`services/`** — clients API + hooks React Query.
- **`store/`** — stores Zustand (ex. `rights/`, via `createStore`/`useStore` vanilla).

## Conventions (front)

- Import via l'alias **`~/`** → `src/*` (`tsconfig.app.json` + `resolve.tsconfigPaths: true` dans `vite.config.ts`, natif Vite 8 — pas de plugin `vite-tsconfig-paths`). `@images/*` → images de `@edifice.io/bootstrap`.
- Prettier : `singleQuote: true`, `tabWidth: 2`, `trailingComma: all`, `printWidth: 80`, `quoteProps: consistent`. **Ne pas** reformater à la main contre Prettier.
- ESLint **flat config** (`eslint.config.js`), `typescript-eslint`, règles **React Compiler** actives via `eslint-plugin-react-hooks` (`configs.flat.recommended`). `tsconfig` strict + `noUnusedLocals`/`noUnusedParameters`.
- Préférer **réutiliser `@edifice.io/react`** plutôt que réécrire un composant UI.
- Accessibilité : `@axe-core/react` actif en dev — corriger les violations.
- i18n : toute chaîne visible passe par i18next (pas de texte en dur). Interpolation avec le préfixe/suffixe `[[` / `]]` (pas `{{ }}`, convention Edifice). `backend.loadPath` doit renvoyer une **string** (pas un tableau) — breaking change d'`i18next-http-backend` v4.
- **`resolve.dedupe`** dans `vite.config.ts` liste les singletons Edifice (`react`, `react-dom`, `@edifice.io/react`, `@edifice.io/client`, `@tanstack/react-query`, `react-hook-form`, `react-i18next`) : à garder si de nouvelles apps héritent de ce gabarit, filet contre la duplication de copies physiques.

## Node / infra

- **Node ≥20.19.0 ou ≥22.12.0** requis (Vite 8/Rolldown). Image Docker de build : `opendigitaleducation/node:22-alpine-pnpm`. Node 24 dès qu'une image `node:24-alpine-pnpm` existe (pas encore publiée).
- `@edifice.io/react` (dist-tag `develop`) pin `react`/`react-dom` en `^18.3.1` et `react-i18next` en `^14.1.0` en peerDependencies — **ne pas** monter ces trois au-delà tant qu'il n'aura pas bougé (double copie physique sinon).

## Tests

- Unitaires/intégration : **Vitest** (jsdom), **Testing Library**, mocks API via **MSW** (`src/mocks/`, `setupFiles: ./src/mocks/setup.ts`).
- Un rendu qui dépend d'un fetch mocké (i18n, conf) doit être asserté avec `findByRole`/`findBy*` (async), pas `getByRole` — le rendu n'est pas synchrone dès qu'un provider attend une réponse réseau, même mockée.
- Lancer un test ciblé : `pnpm test -- <pattern>`.

## À faire / à éviter

- ✅ Garder le build vert : `typecheck` + `lint` + `test` avant de pousser.
- ✅ Après un fork, remplacer toutes les occurrences de `boilerplate` (base path, namespace i18n, `EdificeClientProvider`, scripts, `docker-compose.yml`/CI) par le nom réel de l'app.
- ❌ Ne pas introduire un autre gestionnaire d'état / data-fetching que Zustand + React Query.
- ❌ Ne pas hardcoder le base path : il vaut `/boilerplate` en prod, vide en dev.
- ❌ Ne pas ajouter de styling concurrent (Tailwind, CSS-in-JS) : on reste sur CSS + `@edifice.io/bootstrap`.
- ❌ Ne pas monter `react`/`react-dom` (19), `react-i18next` (>14.x) ou `typescript` (7.x) sans revérifier les peerDependencies de `@edifice.io/react` et `typescript-eslint` (cf. `CHANGELOG.md`).
