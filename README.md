# Edifice React Boilerplate with Vite

This is a [ReactJS](https://reactjs.org) + [Vite](https://vitejs.dev) boilerplate.

## Getting Started

Paste this in your terminal inside a new project

```bash
npx degit edificeio/edifice-react-boilerplate . --force
```

It will clone the boilerplate and create a configured `frontend` folder.

Then, go to the frontend folder.

```bash
cd frontend
```

## Install

**With pnpm**

```bash
pnpm install
```

**With Docker**

Install all dependencies.

```bash
./build.sh initDev
```

**Without Docker**

Install all dependencies.

```bash
./build-noDocker.sh initDev
```

## Dev

You need `nx` installed globally on the machine

```
pnpm add --global nx@latest
```

### Start your project

Start your project with Vite Server + HMR at <http://localhost:4200>.

```bash
pnpm run dev
```

### [Server Options](https://vitejs.dev/config/server-options.html)

You can change Vite Server by editing `vite.config.ts`

```bash
server: {
  host: "0.0.0.0",
  port: 4200,
  open: true // open the page on <http://localhost:4200> when dev server starts.
}
```

### Lint

```bash
pnpm run lint
```

### Prettier

```bash
pnpm run format
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
pnpm run build
```

## License

This project is licensed under the AGPL-3.0 license.
