# AGENTS.md — Frontend Coding Rules

> **Project:** Facebook-like Social Network Frontend  
> **Stack:** React + Vite + TypeScript  
> **Applies to:** All AI coding agents and contributors working in this frontend repository.  
> **Location:** Put this file at the **repository root** (next to `package.json`).

## 1. Operating principles (MUST)

1. **Read before editing.** Inspect `package.json`, TypeScript configuration, existing patterns, and the relevant feature before changing code. Follow the repository's actual setup rather than assuming packages or conventions.
2. **Keep changes scoped.** Implement only the requested task. Avoid unrelated refactors, mass formatting, or dependency upgrades.
3. **Feature-first architecture.** Put feature-specific code inside `src/features/<feature>/`. Put code in shared directories only when it is genuinely reused.
4. **Type safety.** Use TypeScript with explicit domain types. Do not introduce `any` unless unavoidable and documented. Prefer `unknown` with narrowing for untrusted input.
5. **Separation of concerns.** UI components render and handle user events; API modules perform HTTP requests; hooks manage feature behavior and data fetching.
6. **Reuse existing components.** Search for shared UI components, hooks, types, utilities, and API clients before creating new ones.
7. **Do not guess backend contracts.** If a route, DTO, auth mechanism, or event name is unspecified, examine existing contracts first. If still unknown, identify the assumption clearly; do not silently invent a production integration.
8. **Preserve existing behavior.** Do not break routes, auth flows, shared interfaces, or other features while implementing a change.
9. **Validate results.** Run applicable checks listed in `package.json` (lint, typecheck, test, build) when available. Report what ran and what could not be run.
10. **Never expose secrets.** Do not hardcode API keys, credentials, tokens, or private data; do not log sensitive information.

## 2. Expected project structure

```text
src/
├── app/
│   ├── App.tsx                 # Root React component
│   ├── router.tsx              # App routes and route guards
│   └── providers.tsx           # Global providers
├── assets/                     # Static images, SVGs, fonts
├── components/
│   ├── ui/                     # Reusable primitives (Button, Modal, Input...)
│   ├── layout/                 # Header, Sidebar, MainLayout...
│   └── common/                 # Other cross-feature components
├── features/
│   ├── auth/                   # Login, register, session
│   ├── feed/                   # News feed, pagination
│   ├── posts/                  # Post creation and management
│   ├── comments/               # Comments
│   ├── reactions/              # Like and reactions
│   ├── friends/                # Friend requests and relationships
│   ├── profile/                # User profiles
│   ├── chat/                   # Messaging
│   └── notifications/          # Notifications
├── hooks/                      # Truly cross-feature hooks
├── lib/
│   ├── api-client.ts           # Shared HTTP client
│   └── socket.ts               # Shared realtime client setup
├── stores/                     # Cross-feature client/UI state
├── types/                      # Shared types only
├── utils/                      # Shared pure utilities
├── constants/                  # Shared constants
├── styles/                     # Global CSS/theme
└── main.tsx                    # React entry point
```

A feature may contain the following **only as needed** (do not create empty directories just for conformity):

```text
src/features/posts/
├── api/                        # post.api.ts
├── components/                 # PostCard.tsx, PostEditor.tsx
├── hooks/                      # usePosts.ts, useCreatePost.ts
├── pages/                      # PostDetailPage.tsx
├── types/                      # post.types.ts
├── utils/                      # post.helpers.ts
└── index.ts                    # Optional public exports
```

### Architecture boundaries

- Feature-specific components, hooks, types, and helpers belong to their own feature.
- `src/components/`, `src/hooks/`, `src/types/`, and `src/utils/` are for **cross-feature** reuse, not dumping grounds.
- Prefer importing from a feature's public `index.ts` when it exists; avoid reaching into another feature's internal files.
- Avoid circular imports and cross-feature coupling. Move genuinely shared abstractions into a shared location after reviewing ownership.
- Keep `src/app/` focused on application composition and configuration, not feature business logic.
- Do not modify shared contracts (`app/`, `lib/`, shared `components/`, shared types) unnecessarily; describe the impact when changing them.

## 3. Naming and file conventions

| Item | Convention | Example |
|---|---|---|
| React component / TSX file | `PascalCase` | `PostCard.tsx` |
| Page component | `PascalCase` + `Page` | `ProfilePage.tsx` |
| Hook | `camelCase`, starts with `use` | `useInfiniteFeed.ts` |
| Function / variable | `camelCase` | `handleSubmit`, `currentUser` |
| Boolean | `is` / `has` / `can` / `should` prefix | `isLoading`, `hasLiked` |
| Type / interface | `PascalCase` | `Post`, `CreatePostRequest` |
| Constant | `UPPER_SNAKE_CASE` for module-level fixed values | `MAX_UPLOAD_SIZE` |
| Feature folder | `kebab-case` | `friend-requests/` |
| API file | `<domain>.api.ts` | `post.api.ts` |
| Types file | `<domain>.types.ts` | `post.types.ts` |
| Hook file | `useXxx.ts` | `usePosts.ts` |

- Use **English identifiers** in code, file names, and comments where possible.
- Prefer **named exports** for reusable functions/components. Match existing conventions when integrating.
- Import via the configured `@/` alias **only if it exists**; otherwise use valid relative paths and do not invent a new alias silently.
- Avoid confusing abbreviations, giant files, or excessive barrel exports.
- Let the repository's ESLint and Prettier configurations decide formatting; do not impose conflicting styles.

## 4. React component rules

- Use **function components** and React hooks; follow the Rules of Hooks.
- Each component should have one clear responsibility. Extract complex UI or logic into small components/hooks.
- Type props explicitly. Avoid unnecessary `React.FC`; prefer a simple typed props object.
- Keep derived values derived rather than duplicating state; do not use `useEffect` for logic that belongs in render or event handlers.
- Do not call HTTP endpoints directly from presentational components; call feature hooks and API modules instead.
- Do not mutate props or state; use immutable updates.
- Use stable keys from persistent IDs for lists; avoid array indices for dynamic feed/comment/chat lists.
- Support **loading**, **empty**, **error**, and **success** states for asynchronous views.
- Provide accessible labels, buttons, keyboard handling, focus treatment, and image `alt` text.
- Respect responsiveness and existing design tokens/components. Do not duplicate shared UI styles unnecessarily.
- Do not leave debug `console.log`, dead code, unnecessary comments, or commented-out implementations in completed work.

## 5. API and server state

- Use the **existing shared HTTP client** in `src/lib/api-client.ts`. Do not create per-feature Axios instances without a justified need.
- Define endpoint functions in each feature's `api/` directory. Keep request/response types in feature `types/` unless reused across features.
- Keep API base URLs in environment configuration (for Vite, public runtime-build variables use `VITE_`). **Never store secrets in `VITE_` variables**; they are included in client bundles.
- Respect the backend's actual pagination, response envelope, auth, error handling, and DTO conventions.
- If TanStack Query is installed, use it for server state (fetching, caching, mutations, pagination); define consistent query keys and invalidate/update relevant queries after mutations.
- Do **not** duplicate query data into Zustand or component state without a concrete requirement.
- Handle request failures, cancellation/race conditions where relevant, and user-facing error feedback.
- Avoid calling APIs in a render path or triggering uncontrolled refetch loops.

### State ownership

| State category | Preferred owner |
|---|---|
| Local modal / form UI | `useState` or form library |
| Remote posts, comments, profiles | TanStack Query (if installed) |
| Cross-feature UI state (theme, sidebar) | Context or Zustand (if installed) |
| Authentication / session | Existing auth mechanism; never invent token storage |
| Realtime events | Central socket integration + relevant cache/state updates |

## 6. Social-network-specific requirements

- **Feed:** Use the backend's pagination scheme (prefer cursor-based if supported), support incremental loading, and avoid duplicate posts or stale responses.
- **Reactions:** Keep reaction counts and the current user's reaction consistent across feed and detail views. If using optimistic updates, implement rollback/error handling.
- **Comments:** Keep comment lists and counts consistent after create/edit/delete; respect permissions and ordering.
- **Chat:** Manage socket lifecycle centrally; unsubscribe listeners on cleanup. Avoid duplicate messages, handle reconnects, ordering and delivery failures.
- **Notifications:** Keep unread counts and notification lists synchronized with realtime changes and API responses.
- **Media:** Check file type, size, and count in the UI, show upload progress/errors, and clean up object URLs. Client-side validation does **not** replace server-side validation.
- **Profile/auth:** Handle unauthenticated states, expired sessions, missing avatars, and unauthorized actions gracefully.
- **Performance:** Lazy-load routes/heavy views where appropriate; use memoization/virtualization only after identifying a real need.

## 7. Security requirements

- Treat **all user-generated content as untrusted**. Display text through normal React interpolation, not raw HTML injection.
- Avoid `dangerouslySetInnerHTML`. If rich HTML is a requirement, use an approved sanitization approach and follow existing security policy.
- Do not store credentials or secrets in source files or exposed environment variables.
- Follow the backend's existing session/token strategy; do not move tokens into `localStorage` without an explicit security decision.
- Do not rely on route guards or hidden buttons for authorization: the backend must enforce permissions.
- If cookie auth is used, coordinate CSRF protection with backend; configure CORS and credentials according to the actual API contract.
- Avoid logging tokens, full user records, private messages, and sensitive payloads.

## 8. Realtime (WebSocket / Socket.IO)

- Use the existing `src/lib/socket.ts` integration when present; do not create a new socket connection in every component.
- Keep event names and payload types consistent with the backend contract.
- Register listeners within an appropriate lifecycle and **remove them during cleanup**.
- Prevent duplicate listener registrations, duplicate messages, and stale event closures.
- Handle disconnection and reconnection; clean up on logout/account switch as required.
- Update relevant TanStack Query cache or owned state after realtime events instead of maintaining conflicting copies.

## 9. Styling and UI consistency

- Follow the UI stack already installed in the repository (e.g., Tailwind CSS, shadcn/ui); do not add another UI framework without approval.
- Reuse theme tokens, spacing rules, and existing components before writing new variants.
- Account for mobile, tablet, and desktop layouts as appropriate.
- Use semantic HTML and accessible interactive controls instead of clickable generic `div` elements.
- Keep styles scoped and predictable; avoid broad global selectors that affect unrelated features.

## 10. Team and Git rules

- Work on a dedicated branch: `feature/<short-topic>`, `fix/<short-topic>`, or `refactor/<short-topic>`.
- Use meaningful Conventional Commit messages when commits are requested, e.g.:
  - `feat(posts): add post composer`
  - `fix(feed): prevent duplicate items`
  - `refactor(chat): extract socket listener hook`
- Never push directly to `main` or `develop` unless explicitly authorized by the repository owners.
- Do **not** commit, push, force-push, merge, rebase, or modify Git history unless the user specifically requests it.
- Do not overwrite uncommitted work or delete files you do not own; inspect changes before editing.
- Keep PRs small, explain changes and API impacts, and seek review for shared-code modifications.

## 11. Testing and completion checklist

Before marking a task complete:

- [ ] The change matches the request and stays within the relevant feature.
- [ ] Existing abstractions and shared components were reused where appropriate.
- [ ] TypeScript types and backend data contracts are consistent.
- [ ] Async UX covers loading/empty/error/success as relevant.
- [ ] No insecure HTML rendering, exposed secrets, or sensitive logs were added.
- [ ] Effects, subscriptions, timers, socket listeners, and object URLs clean up correctly.
- [ ] Responsive and accessibility considerations were checked.
- [ ] Existing tests were updated or focused tests added when warranted.
- [ ] Available lint / typecheck / test / build commands were run where feasible.
- [ ] No unrelated files, lockfiles, or dependencies were changed.

### How agents should report completion

In the final response, briefly provide:

1. **What changed** (features/files).
2. **Why** (high-level design decision if non-obvious).
3. **Validation** (commands run and results; say if not run).
4. **Open issues/assumptions** (especially backend API or realtime contracts).

## 12. Decision rules when instructions conflict

1. Follow explicit user requirements and repository-specific documentation that apply to the current task, provided they do not conflict with higher-priority safety and system instructions.
2. Prefer **existing repository patterns** over examples in this file when they differ in implementation details.
3. If changing shared architecture is necessary, make the smallest compatible change and clearly describe its impact.
4. Never fabricate installed packages, endpoints, DTO fields, environment variables, or passing tests.

---

**Core rule:** Keep each feature independent, keep shared code intentional, keep types and APIs aligned, and make every change easy for teammates to review.
