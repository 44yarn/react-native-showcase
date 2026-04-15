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
├── (main)/home.tsx          Home route
├── (main)/info.tsx          Info route
src/
├── core/
│   ├── foundation/          Result<T>, utility types
│   ├── ui/                  Theme tokens, shared components
│   └── data/                Repositories
├── feature/
│   ├── login/               LoginScreen + useLoginStore
│   ├── home/                HomeScreen
│   └── info/                InfoScreen
```

Dependencies flow: `app/ → feature/* → core/*`. Features never import each other.

### Key Patterns

- **Store (Zustand)**: 1 screen = 1 store. Combines UiState and Actions in a single `create()`.
- **Effect**: Store emits effects; `app/` route files consume them for navigation.
- **Result\<T\>**: `runCatching()` wraps async calls. Repositories return `Result<T>`, stores never use try-catch directly.
- **Theme**: `AppTheme` tokens in `core/ui/theme.ts`. No magic numbers in styles.
- **StyleSheet.create**: Standard React Native styling. Inline styles only for dynamic values.

## Code Style

Biome enforced. 2-space indent, single quotes, no semicolons.
