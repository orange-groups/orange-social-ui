# Orange UI

React + Vite + TypeScript frontend with VI/EN translations, light/dark themes, and local UI preview routes.

```bash
npm ci
npm run dev
```

Open `/` for the landing page or `/login` for authentication UI. Valid forms lead to `/preview`; no authentication or email requests are made in this preview phase.

See [Auth UI guide](src/features/auth/README.md) for routes, component ownership, translations, themes, and review steps.

```bash
npm run check:locales
npm run lint
npm run build
```

Production SPA hosting must rewrite UI routes to `index.html` to support direct links and refresh.
