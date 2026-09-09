# Changelog

Toutes les évolutions notables de ce gabarit sont documentées ici, au format
[Keep a Changelog](https://keepachangelog.com/fr/1.0.0/). Ce fichier suit le
gabarit lui-même, pas les apps qui en sont issues.

Si vous avez forké ce boilerplate avant une version listée ici, la section
correspondante indique ce qui a changé et comment adapter votre fork.

## [1.0.0] - 2026-09-09

Première version suivie du gabarit — jusqu'ici resté en `0.0.0`, sans
changelog. Ce lot de changements modernise l'ensemble du socle front.

### Changed

- **Vite 5 → 8**, **Vitest 2 → 5** (et `@vitest/coverage-v8`, `@vitest/ui`),
  **`@vitejs/plugin-react` 4 → 6**.
- **Node ≥20.19.0 ou ≥22.12.0 requis** — Vite 8 embarque Rolldown (bundler en
  Rust) dont le binding natif ne fonctionne pas sur Node 20.18.x. L'image
  Docker de build (`frontend/docker-compose.yml`) passe de
  `node:20-alpine-pnpm` à `node:22-alpine-pnpm`, ainsi que le
  `node-version` du workflow GitHub Actions. **Node 24 dès qu'une image
  `node:24-alpine-pnpm` sera publiée** (pas encore disponible à ce jour —
  Node 22 est en Maintenance LTS jusqu'à avril 2027, donc pas bloquant).
- `vite-tsconfig-paths` remplacé par l'option native `resolve.tsconfigPaths:
  true` de Vite 8 (une dépendance en moins).
- `eslint` 9 → 10, `@eslint/js` 9 → 10, `globals` 15 → 17,
  `eslint-plugin-react-hooks` 5 → 7.1.1 (la 5.x ne supporte pas ESLint 10 ;
  la 6.x n'a jamais eu de release stable). La v7 inclut par défaut les
  règles **React Compiler** dans `recommended` — testé, 0 erreur sur ce
  codebase, mais un fork avec plus de composants peut en révéler.
- `lint-staged` 15 → 17, `jsdom` 25 → 30,
  `@testing-library/jest-dom` 6 → 7, `zustand` 4 → 5, `nx` 19 → 23.
- `react-router-dom` 6 → 7 (même surface d'API utilisée ici : data router,
  routes lazy, `matchPath`, `useNavigate`/`useRouteError`).
- `i18next` 23 → 26. `react-i18next` reste en **14.1.3** volontairement (cf.
  Non changé ci-dessous).
- `i18next-http-backend` 2 → 4 — **changement cassant** : l'option
  `backend.loadPath` doit désormais renvoyer une **chaîne**, plus un
  tableau (`interpolateUrl` appelle `str.replace(...)` sans vérifier le
  type). Si votre fork a copié le pattern multi-namespace de
  `src/i18n.ts`, adaptez-le pour ne traiter qu'un seul namespace par appel.
  Autre effet : un namespace i18n non mocké dans les tests provoque
  maintenant un vrai échec réseau (fetch natif, plus de fallback
  `cross-fetch`) qui peut bloquer le rendu au lieu d'échouer
  silencieusement — voir le correctif apporté à `App.test.tsx`
  (`getByRole` → `findByRole` avec timeout) si vous rencontrez un test qui
  timeout après cette mise à jour.
- `typescript` 5.9 → **6.0.3** (pas 7.x, cf. Non changé). Retire `baseUrl`
  de `tsconfig.app.json` (déprécié en 6.0, supprimé en 7.0) au profit de
  chemins `paths` préfixés `./` — seule adaptation nécessaire pour ce saut
  de version.
- `eslint-plugin-react-refresh` 0.4 → 0.5, `msw` 2.12 → 2.15,
  `prettier` 3.8 → 3.9, `typescript-eslint` 8.57 → 8.70,
  `@tanstack/react-query`/`-devtools`, `react-hook-form`, `@axe-core/react`,
  `@testing-library/react`, `@types/react`/`@types/react-dom` (patchs).

### Removed

- Dépendances jamais importées dans le code : `@react-spring/web`,
  `@uidotdev/usehooks`, `ode-explorer`, `react-error-boundary`,
  `@testing-library/user-event` — vérifié également sur les 15 apps sœurs
  avant suppression (usage marginal ou nul partout).

### Fixed

- Duplication de copies physiques des singletons Edifice
  (`@edifice.io/react`, `@edifice.io/client`, `@tanstack/react-query`,
  `react`, `react-dom`) : ajout de `resolve.dedupe` dans `vite.config.ts` et
  retrait de la déclaration `ode-explorer` inutilisée qui la propageait
  (cf. la norme ENABLING-1099 sur les versions de packages).
- `index.html` : `<title>` statique ajouté (warning axe-core), favicon
  passé de `href=""` à `href="data:,"` pour éviter la requête
  `/favicon.ico` à vide — le mécanisme dynamique (`EdificeThemeProvider`)
  continue de l'écraser une fois le thème résolu.
- `eslint.config.js` : imports de plugins avec extension `.ts` explicite et
  `__dirname` → `import.meta.dirname` (requis par le config-loader natif de
  Vite 8).

### Non changé — bloqué par les peerDependencies

Tant que `@edifice.io/react` (dist-tag `develop`, choix intentionnel — voir
ENABLING-1099) n'aura pas bougé lui-même :

- **`react` / `react-dom` restent en 18.3.1** — peer exact `^18.3.1`.
  Passer à React 19 créerait une double copie du singleton.
- **`react-i18next` reste en 14.1.3** — peer `^14.1.0`. Idem, une 17.x
  créerait une double copie et casserait potentiellement le contexte de
  traduction partagé.
- **`typescript` reste en 6.0.3, pas 7.x** — `typescript-eslint` (toute
  version publiée à ce jour) plafonne son peer à `<6.1.0`.
