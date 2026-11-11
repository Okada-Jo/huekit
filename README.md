# Huekit 🎨

A simple, playful **color palette generator**, built with **Vue 3 + Vite**. Generate harmonized color palettes, keep your favorites, and turn them into CSS variables.

## Features

- 🎲 Generate five-color palettes in a variety of color harmonies
- 🔒 Lock colors to keep them when generating a new palette
- 📋 Click a color to copy its HEX value
- 🖼️ Live design preview using the current palette
- 💾 Save up to eight palettes to your browser (localStorage)
- ↩️ Restore or delete a saved palette
- 📄 Export your palette as a `.css` file
- ⌨️ Press **Space** to generate colors (when not focusing an interactive element)
- 📱 Responsive layout

## Run locally

Requirements: Node.js **20.19+** or **22.12+** (to satisfy Vite 7).

```bash
npm install
npm run dev
```

Open the local URL shown in your terminal (usually http://localhost:5173).

Build and test the production site:

```bash
npm run build
npm run preview
```

## Lint and format

```bash
npm run lint
npm run format
```

`npm run lint` checks JavaScript and Vue files with ESLint and CSS with Stylelint. `npm run format` formats the app source with Prettier; use `npm run format:check` to verify formatting without changing files.

## Project structure

```text
huekit-vue/
├── src/
│   ├── components/
│   │   ├── ColorTile.vue          # Swatch, HEX label, lock/copy actions
│   │   └── SavedPaletteCard.vue   # Restore and delete saved palettes
│   ├── lib/colors.js              # Palette generation and color helpers
│   ├── App.vue                    # UI + reactive application state
│   ├── main.js                    # Vue entry point
│   └── style.css                  # Responsive styling
├── public/favicon.svg
├── .github/workflows/deploy.yml  # GitHub Pages deployment
├── index.html
├── .eslintrc.cjs
├── .prettierrc.json
├── .stylelintrc.json
├── vite.config.js
└── package.json
```

## Publish on GitHub Pages

This repository contains a GitHub Actions workflow that builds and deploys the site on pushes to `main`.

1. Push the project to a public GitHub repository.
2. In the repository, open **Settings → Pages**.
3. For **Build and deployment**, choose **GitHub Actions**.
4. Push to `main` if a deployment isn't already running. Open **Actions** to follow progress.

The Vite `base: './'` configuration supports GitHub Pages project URLs such as `https://YOUR-USERNAME.github.io/huekit/`.

## Tech stack

- Vue 3 Composition API (`<script setup>`, `ref`, `computed`)
- Vite 7
- Plain CSS (no UI component library)
- Browser localStorage

No backend, account, or external API required. Google Fonts are used for the typography.

## License

MIT
