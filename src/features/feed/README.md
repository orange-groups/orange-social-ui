# Home feed UI

Visit `/home` or select Explore your feed on `/preview`. The landing page remains at `/`.

Based on the three-column feed reference in `orange social ui.docx`. Uses existing theme tokens, Be Vietnam Pro, and shared appearance controls.

Local interactions: post text/image (5 MB max), like/unlike, comments, save/unsave, saved filter, text search, friend request confirmation/dismissal, friend suggestion requests, and story dialogs. State lasts only while the page is mounted. No backend calls or authentication are implemented. Community names and online contacts are display-only. Images use Unsplash URLs and require internet access.

Translations: `src/i18n/locales/{vi,en}/home.json`.
Validation: `npm run lint`, `npm run check:locales`, `npm run build`.
