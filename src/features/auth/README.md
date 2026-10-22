# Auth UI preview

Start with `npm run dev` and open `/login`. This feature is a client-side UI preview: valid forms navigate to `/preview`, without authenticating, creating accounts, sending email, or retaining credentials.

## Routes

| Route | UI |
| --- | --- |
| `/` | Landing page |
| `/login` | Sign in, register link, password recovery link |
| `/register` | Full name, email, password, password confirmation |
| `/forgot-password` | Email form and return-to-login link |
| `/preview` | Explicit preview result and links to retry each flow |
| Other paths | Localized not-found page |

React Router handles navigation and browser Back/Forward. Refresh and direct URLs work with Vite; production hosting must rewrite unknown paths to `index.html`.

## Components

- `AuthLayout`: shared story panel, page heading, preferences, preview note and footer.
- `AuthStory` / `AuthBrand` / `AuthIcon`: feature visuals.
- `LoginForm`: sign-in form; `useLoginForm` owns validation and preview navigation.
- `AccountForm`: registration/recovery fields; `useAccountForm` owns validation and preview navigation.
- `AuthField`: label, input, validation error, password visibility.
- `pages/`: route composition only.

`AuthNotice` was replaced by dedicated registration and password-recovery routes.

## Translations

All UI copy, validation messages, placeholders, document titles, and accessible labels live in:

```text
src/i18n/locales/vi/{common,auth,landing}.json
src/i18n/locales/en/{common,auth,landing}.json
```

Use `useTranslation('auth')` and `t('login.title')`; do not put Vietnamese/English conditionals or prose in components. Store validation translation keys in state so existing errors translate immediately when the language changes. TypeScript checks translation keys through `src/i18n/i18next.d.ts`.

Default language is VI. The VI/EN selector is shared on landing and auth pages. The selected language persists under `orange-language`; `html.lang` and page titles update with it. If storage is unavailable, switching still works in the current app session.

## Themes

```text
src/styles/themes/light.css
src/styles/themes/dark.css
src/app/theme/ThemeProvider.tsx
src/components/preferences/AppearanceControls.tsx
```

Both theme files define the same semantic CSS tokens. Layout styles consume tokens, including SVG illustration colors. Add a new token to both themes. Avoid adding color literals to component styles.

Without a saved preference, theme follows the system. An explicit selection persists under `orange-theme`. The bootstrap in `index.html` applies theme before React loads to avoid a light flash in dark mode. Only display preferences are stored; form credentials are never stored.

## Checks

```bash
npm run check:locales
npm run lint
npm run build
```

Review both languages and themes at desktop/mobile widths; check form errors, password visibility, navigation, refresh, Back/Forward, and preference persistence. No backend checks are needed for this UI phase.
