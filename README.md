# React Native Architecture Showcase

[日本語版はこちら](README.ja.md)

A sample application demonstrating React Native architecture patterns.
Built with Expo Router, Zustand, and a feature-based directory layout,
showcasing practical design patterns through concrete code.

This is the React Native counterpart to [android-architecture-showcase](https://github.com/44yarn/android-architecture-showcase)
and [kmp-architecture-showcase](https://github.com/44yarn/kmp-architecture-showcase) —
the same screen flow is reimplemented with each stack's idioms.

## Screen Flow

```
Login ─── Success ────────────→ Home ("Welcome, {name}!" Snackbar)
  │                                PreferenceStorage demo (Remember Email)
  │
  ├─── Failure → ErrorDialog
  │         ├─ Cancel → dismiss
  │         ├─ Guest Login → Home ("Guest mode" Snackbar)
  │         └─ outside tap → dismiss
  │
  └─── Information → Info screen (separate route, Effect-driven navigation)
```

## Showcased Patterns

| Screen | Feature | Patterns |
|--------|---------|----------|
| Login | feature/login | Dialog (Promise-based Presenter), IndicatorState, Effect (route navigation) |
| Home | feature/home | Snackbar (Presenter direct), PreferenceStorage, Session store, BackHandler |
| Info | feature/info | Expo Router push, Effect-driven navigation |

### Three UI Feedback Patterns

| Pattern | Use Case | Mechanism |
|---------|----------|-----------|
| Effect | Fire-and-forget (navigation) | Zustand `effect` state + `consumeEffect()` in the route file |
| Dialog | Awaiting user response | `DialogPresenter.requestDialog()` returning a `Promise` |
| Snackbar | Immediate display | `snackbarPresenter.show()` direct call (auto-dismiss in 3s) |

### Other Design Patterns

- **1 screen = 1 Zustand store** — State and Actions combined in a single `create()` call
- **Effect pattern** — The store emits navigation effects; the `app/` route file consumes them (keeps `feature/` decoupled from routing)
- **Result\<T\> + runCatching** — Repositories return `Result<T>`; stores never use `try/catch` directly
- **Module-scope internals** — Implementation details like `resolve` callbacks and `nextId` counters live in module scope, not in Zustand state, so they don't leak into UI selectors
- **`_initialized` flag + `reset()`** — Stores guard against double-init in StrictMode and expose a reset path for logout
- **AbortController cancellation** — `submit()` uses `AbortController` so a cancel action stops the in-flight request without relying on structured concurrency (which JS lacks)
- **useAppColors() + inline styles** — Color tokens resolve at render time to support dark mode via `Appearance`

## Directory Structure

```
app/                         Expo Router (routing only — no logic)
├── _layout.tsx              Root Stack + global ShowcaseAlertDialog
├── (auth)/login.tsx         Login route + Effect consumer
├── (main)/home.tsx          Home route + BackHandler
└── (main)/info.tsx          Info route
src/
├── core/
│   ├── foundation/          Result<T>, utility types
│   ├── ui/                  Theme, DialogPresenter, SnackbarPresenter, IndicatorState
│   ├── i18n/                Localization (en / ja)
│   └── data/                Repositories, PreferenceStorage, useSessionStore
└── feature/
    ├── login/               LoginScreen + useLoginStore
    ├── home/                HomeScreen + useHomeStore
    └── info/                InfoScreen
```

Dependency direction: `app → feature → core` (unidirectional). Features never import each other.
Cross-feature coordination (e.g. resetting stores on logout) happens in the `app/` routing layer.

## Design Highlights

### DialogPresenter — Promise-based Suspension

`requestDialog()` shows a dialog and returns a `Promise<DialogResult>` that resolves when the user taps a button.
Callback-driven dialog handling collapses into straightforward `await`.

```ts
const result = await requestDialog({
  title: t('login.errorTitle'),
  message: t('login.errorMessage'),
  positiveButton: t('login.guestLogin'),
  negativeButton: t('login.cancel'),
})
if (result === 'positive') {
  // handle Guest Login
}
```

### IndicatorState — Decoupled Loading State

A small Zustand store holds `isLoading`. Stores call `startLoading()` / `stopLoading()` explicitly, because JavaScript lacks structured concurrency — there is no direct equivalent of Kotlin's `runWithLoading { ... }`.

Cancellation is implemented with `AbortController` instead: `cancelLogin()` aborts the signal, and the post-await branch bails out before touching state.

### Effect Pattern — Store-to-Route Navigation

Feature stores don't import `expo-router`. They emit an `effect` value, and the corresponding `app/` route file consumes it.

```ts
// feature/login/useLoginStore.ts
set({ effect: { type: 'navigateToHome' } })

// app/(auth)/login.tsx
useEffect(() => {
  if (effect?.type === 'navigateToHome') {
    consumeEffect()
    router.replace('/(main)/home')
  }
}, [effect])
```

### Module-scope Internals — Keeping Store State UI-relevant

Promise `resolve` callbacks (DialogPresenter) and incrementing IDs (SnackbarPresenter) stay in module scope, not in Zustand state. This keeps store state purely UI-relevant and avoids accidentally subscribing components to re-render on internal bookkeeping changes.

### `_initialized` Flag + `reset()` — Lifecycle Safety

StrictMode and route remounts can call a store's `init()` multiple times. Each store guards with `_initialized` and exposes a `reset()` that aborts pending work, clears state, and flips the flag back — called from the `app/` layer at logout.

### PreferenceStorage — Best-effort Secure Storage

`expo-secure-store` backs the storage layer (AsyncStorage is not supported by Expo Go). Reads/writes are wrapped in `try/catch` — storage failures are treated as best-effort and never crash the app.

## Tech Stack

| Category | Library |
|----------|---------|
| Language | TypeScript 5.9 |
| Runtime | React Native 0.81 + Expo SDK 54 |
| UI | React Native core components + `@expo/vector-icons` |
| State | Zustand 5 |
| Navigation | Expo Router 5 (file-based) |
| Async | Promise / async-await + AbortController |
| Storage | expo-secure-store |
| Localization | expo-localization + i18n-js |
| Code Quality | Biome |
| Testing | Jest (planned) |

## Build

```bash
bun install                  # install dependencies
bun run start                # start the Expo dev server
bun run ios                  # run on iOS simulator
bun run android              # run on Android emulator
bun run web                  # run in the browser
bun run lint                 # Biome lint check
bun run format               # Biome auto-format
```

### Requirements

- Node.js 20+
- Bun 1.3+
- Expo Go app on a device/simulator, or a native build toolchain

## License

    Copyright 2026 44yarn

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
