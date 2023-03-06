# Open Digital Education React Boilerplate with Vite

This is a [ReactJS](https://reactjs.org) + [Vite](https://vitejs.dev) boilerplate.

## What is inside?

Many tools are already configured like:

- [ReactJS](https://reactjs.org)
- [Vite](https://vitejs.dev)
- [TypeScript](https://www.typescriptlang.org)
- [...](./TOOLS.md)

[See all tools](./TOOLS.md)

## Getting Started

### Install

Create the project with the name of your app (Ex: blog)

```bash
npx degit opendigitaleducation/ode-react-boilerplate blog
```

Go to the project directory.

```bash
cd blog
```

Git init, commit and push to remote repository

```bash
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:<ORG>/<app>.git
git push -u origin main
```

Install all dependencies.

```bash
pnpm install
```

## Dev

### Start project

Open your project with Vite Server + HMR at <http://localhost:3000>.

```bash
pnpm dev
```

### [Server Options](https://vitejs.dev/config/server-options.html)

You can change Vite Server by editing `vite.config.ts`

```bash
server: {
  host: "0.0.0.0",
  port: 3000,
  open: true // open the page on <http://localhost:3000> when dev server starts.
}
```

### Absolute Imports

You should use absolute imports in your app

```bash
Replace ../components/* by components/*
```

Edit `vite.config.ts` and add an `alias`

> Telling Vite how to build import path:

```bash
alias: [
  { find: "~", replacement: path.resolve(__dirname, "src") },
  {
    find: "components",
    replacement: path.resolve(__dirname, "./src/components"),
  },
]
```

Add your new path to `tsconfig.json`:

> Telling TypeScript how to resolve import path:

```bash
"baseUrl": "./src",
"paths": {
  "components/*": ["./components/*"],
}
```

### Lint

```bash
turbo lint
```

### Prettier

```bash
turbo fmt
```

### Lighthouse

> LHCI will check if your app respect at least 90% of these categories: performance, a11y, Best practices and seo

```bash
turbo lh
```

### Pre-commit

When committing your work, `pre-commit` will start `pnpm lint-staged`:

> lint-staged starts lint + prettier

```bash
pnpm pre-commit
```

## Build

TypeScript check + Vite Build

```bash
pnpm build
```

## Preview

```bash
pnpm preview
```

## License

This project is licensed under the AGPL-3.0 license.
