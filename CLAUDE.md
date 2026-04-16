# React Native Architecture Showcase

React Native (Expo) version of android-architecture-showcase. Implements the same screens (Login / Home / Info) with Expo Router and Zustand.

## Build & Development Commands

```bash
npm start                    # Start Expo dev server
npm run ios                  # Start on iOS simulator
npm run android              # Start on Android emulator
npm run web                  # Start on web
npm test                     # Run tests
npm run lint                 # Biome lint check
npm run format               # Biome auto-format
```

Requires **Node.js 20+**.

## Public Repository

This repository is public on GitHub.
`CLAUDE.md` is tracked in Git, so it must not contain personal dev environment details, workflows, or local paths.
Put those in `.claude/project-context.md` (gitignored).

## Architecture

### Directory Structure

```
app/                         Expo Router (routing only)
├── (auth)/login.tsx         Login route + Effect consumer
├── (main)/home.tsx          Home route + BackHandler
├── (main)/info.tsx          Info route
src/
├── core/
│   ├── foundation/          Result<T>, utility types
│   ├── ui/                  Theme, DialogPresenter, SnackbarPresenter, IndicatorState
│   ├── i18n/                Internationalization (en/ja)
│   └── data/                Repositories, PreferenceStorage, SessionStore
├── feature/
│   ├── login/               LoginScreen + useLoginStore
│   ├── home/                HomeScreen + useHomeStore
│   └── info/                InfoScreen
```

Dependencies flow: `app/ → feature/* → core/*`. Features never import each other.

### Key Patterns

- **Store (Zustand)**: 1 screen = 1 store. Combines State and Actions in a single `create()`.
- **Effect**: Store emits effects; `app/` route files consume them for navigation.
- **Result\<T\>**: `runCatching()` wraps async calls. Repositories return `Result<T>`, stores never use try-catch directly.
- **DialogPresenter**: Promise-based dialog with `requestDialog()`. Store awaits result, UI renders via `ShowcaseAlertDialog`.
- **SnackbarPresenter**: Auto-dismiss snackbar (3s). `SnackbarView` renders with slide animation.
- **IndicatorState**: Global loading state with `startLoading()` / `stopLoading()`. Cancellable via `AbortController`.
- **Theme**: `AppTheme` tokens + `useAppColors()` for dark mode. No magic numbers in styles.
- **i18n**: `expo-localization` + `i18n-js`. All UI strings via `t('key')`.
- **StyleSheet.create**: Standard React Native styling. Colors via `useAppColors()` inline style for dark mode.

## Code Style

Biome enforced. 2-space indent, single quotes, no semicolons.
