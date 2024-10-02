# Edifice React Boilerplate with Vite

This is a [ReactJS](https://reactjs.org) + [Vite](https://vitejs.dev) boilerplate.

## Getting Started

<<<<<<< HEAD
Paste this in your terminal inside a new project
=======
Create the project inside the project of your app
>>>>>>> 4a44943 (chore: update dependencies)

```bash
npx degit edificeio/edifice-react-boilerplate . --force
```

<<<<<<< HEAD
It will clone the boilerplate and create a configured `frontend` folder.

Then, go to the frontend folder.
=======
Go to the project directory.
>>>>>>> 4a44943 (chore: update dependencies)

```bash
cd frontend
```

## Install

<<<<<<< HEAD
**With pnpm**

=======
>>>>>>> 4a44943 (chore: update dependencies)
```bash
pnpm install
```

<<<<<<< HEAD
**With Docker**
=======
### With Docker
>>>>>>> 4a44943 (chore: update dependencies)

Install all dependencies.

```bash
./build.sh initDev
```

<<<<<<< HEAD
**Without Docker**
=======
### Without Docker
>>>>>>> 4a44943 (chore: update dependencies)

Install all dependencies.

```bash
./build-noDocker.sh initDev
```

## Dev

You need `nx` install globaly on your machine

```
pnpm add --global nx@latest
```

<<<<<<< HEAD
### Start your project

Start your project with Vite Server + HMR at <http://localhost:4200>.
=======
### Start project

Open your project with Vite Server + HMR at <http://localhost:3000>.
>>>>>>> 4a44943 (chore: update dependencies)

```bash
nx serve
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
nx lint
```

### Prettier

```bash
nx format
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
nx build
```

## License

This project is licensed under the AGPL-3.0 license.
