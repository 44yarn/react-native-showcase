# React Native Architecture Showcase

[English](README.md)

React Native アーキテクチャパターンを実演するサンプルアプリケーション。
Expo Router、Zustand、feature 単位のディレクトリ構成を軸に、
実務で使える設計パターンを具体的なコードで示します。

本リポジトリは [android-architecture-showcase](https://github.com/44yarn/android-architecture-showcase) と
[kmp-architecture-showcase](https://github.com/44yarn/kmp-architecture-showcase) の React Native 版で、
同じ画面構成を各スタックのイディオムで書き換えています。

## 画面構成

```
Login ─── Login 成功 ──────────→ Home（"Welcome, {name}!" Snackbar）
  │                                PreferenceStorage デモ（Remember Email）
  │
  ├─── Login 失敗 → ErrorDialog
  │         ├─ Cancel → 閉じる
  │         ├─ Guest Login → Home（"Guest mode" Snackbar）
  │         └─ 外タップ → 閉じる
  │
  └─── Information → Info 画面（別ルート、Effect による遷移）
```

## showcase するパターン

| 画面 | Feature | パターン |
|------|---------|----------|
| Login | feature/login | Dialog（Promise ベース Presenter）、IndicatorState、Effect（ルート遷移） |
| Home | feature/home | Snackbar（Presenter direct）、PreferenceStorage、Session store、BackHandler |
| Info | feature/info | Expo Router push、Effect による遷移 |

### UI フィードバック 3パターン

| パターン | 用途 | 仕組み |
|----------|------|--------|
| Effect | fire-and-forget（画面遷移） | Zustand の `effect` state + route ファイルでの `consumeEffect()` |
| Dialog | ユーザー応答を待つ | `DialogPresenter.requestDialog()` が `Promise` を返す |
| Snackbar | 即時表示 | `snackbarPresenter.show()` 直接呼び出し（3秒自動非表示） |

### その他の設計パターン

- **1 画面 = 1 Zustand store** — State と Actions を単一の `create()` にまとめる
- **Effect パターン** — store は遷移 Effect を発行するだけ。`app/` の route ファイルが消費する（feature/ をルーティングから疎結合に保つ）
- **Result\<T\> + runCatching** — Repository は `Result<T>` を返し、store 側では `try/catch` を直接書かない
- **内部実装詳細はモジュールスコープに置く** — `resolve` コールバック、`nextId` カウンタ等は Zustand state ではなくモジュールスコープに置き、UI セレクタに漏らさない
- **`_initialized` フラグ + `reset()`** — StrictMode の二重初期化を防ぎ、ログアウト時のリセット経路を明示する
- **AbortController によるキャンセル** — `submit()` は `AbortController` を使い、キャンセル操作で in-flight のリクエストを止める（JS には構造化された並行性がないため）
- **useAppColors() + inline style** — カラートークンをレンダリング時に解決し、`Appearance` 経由でダークモード対応

## ディレクトリ構成

```
app/                         Expo Router（ルーティング定義のみ・ロジックなし）
├── _layout.tsx              ルート Stack + グローバル ShowcaseAlertDialog
├── (auth)/login.tsx         Login ルート + Effect 消費
├── (main)/home.tsx          Home ルート + BackHandler
└── (main)/info.tsx          Info ルート
src/
├── core/
│   ├── foundation/          Result<T>、ユーティリティ型
│   ├── ui/                  Theme、DialogPresenter、SnackbarPresenter、IndicatorState
│   ├── i18n/                多言語対応（en / ja）
│   └── data/                Repository、PreferenceStorage、useSessionStore
└── feature/
    ├── login/               LoginScreen + useLoginStore
    ├── home/                HomeScreen + useHomeStore
    └── info/                InfoScreen
```

依存方向: `app → feature → core`（一方向）。feature 同士は直接 import しない。
feature 間の連携（ログアウト時の store リセット等）は `app/` のルーティング層で行う。

## 設計の工夫ポイント

### DialogPresenter — Promise ベースの待ち受け

`requestDialog()` はダイアログを表示し、ユーザーがボタンをタップしたら `Promise<DialogResult>` が resolve する。
コールバック地獄に陥りがちなダイアログ処理を、直線的な `await` で書ける。

```ts
const result = await requestDialog({
  title: t('login.errorTitle'),
  message: t('login.errorMessage'),
  positiveButton: t('login.guestLogin'),
  negativeButton: t('login.cancel'),
})
if (result === 'positive') {
  // Guest Login 処理
}
```

### IndicatorState — ローディング状態の分離

小さな Zustand store に `isLoading` を持たせ、store 側から `startLoading()` / `stopLoading()` を明示的に呼ぶ。
JavaScript には構造化された並行性がないため、Kotlin の `runWithLoading { ... }` のような等価物は提供しない。

キャンセルは `AbortController` で実装する: `cancelLogin()` で signal を abort し、await 後に signal.aborted をチェックして state 更新をスキップする。

### Effect パターン — store からルート遷移を宣言

feature store は `expo-router` を import しない。`effect` 値を発行するだけで、対応する `app/` の route ファイルが消費する。

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

### 内部実装詳細をモジュールスコープに置く

Promise の `resolve` コールバック（DialogPresenter）や Snackbar の連番 ID（SnackbarPresenter）は Zustand state ではなくモジュールスコープに置く。store state を UI に必要なものだけに保ち、内部カウンタの更新で余計な再レンダリングが走らないようにする。

### `_initialized` フラグ + `reset()` — ライフサイクルの安全性

StrictMode やルート再マウントで store の `init()` が複数回呼ばれる可能性がある。各 store は `_initialized` でガードし、pending な処理を abort して state をクリアする `reset()` を公開する。ログアウト時に `app/` 層から呼び出す。

### PreferenceStorage — best-effort なセキュアストレージ

ストレージ層は `expo-secure-store` を使う（AsyncStorage は Expo Go で非対応）。読み書きは `try/catch` で包み、ストレージ障害は best-effort として握り潰してアプリがクラッシュしないようにする。

## 技術スタック

| カテゴリ | ライブラリ |
|----------|-----------|
| 言語 | TypeScript 5.9 |
| ランタイム | React Native 0.81 + Expo SDK 54 |
| UI | React Native 標準コンポーネント + `@expo/vector-icons` |
| 状態管理 | Zustand 5 |
| Navigation | Expo Router 5（file-based） |
| 非同期 | Promise / async-await + AbortController |
| データ保存 | expo-secure-store |
| 多言語対応 | expo-localization + i18n-js |
| コード品質 | Biome |
| テスト | Jest（予定） |

## ビルド

```bash
bun install                  # 依存パッケージのインストール
bun run start                # Expo 開発サーバー起動
bun run ios                  # iOS シミュレータで実行
bun run android              # Android エミュレータで実行
bun run web                  # ブラウザで実行
bun run lint                 # Biome による lint
bun run format               # Biome による自動フォーマット
```

### 動作要件

- Node.js 20 以上
- Bun 1.3 以上
- Expo Go（端末 or シミュレータ）、またはネイティブビルド環境

## ライセンス

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
