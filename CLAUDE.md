# Development Guideline

## プロジェクト概要

Hagetter は Mastodon 向けの Togetter ライクなポストまとめプラットフォームで、Next.js + TypeScript + Firebase で構築されています。Tailwind CSS v4 と shadcn/ui を使用したモダンな UI アーキテクチャを採用しています。

## 技術スタック

### フロントエンド

- **フレームワーク**: Next.js 16
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
  - **UI ライブラリ**: shadcn/ui, Radix UI
  - **スタイル管理**: clsx, tailwind-merge
  - **アニメーション**: CSS Animations (Tailwind 組み込み)
- **状態管理**: MobX + MobX State Tree
- **フォーム**: React Hook Form + Zod
- **アイコン**: Lucide React, Radix Icons

### バックエンド

- **データベース**: Firebase Firestore
- **サーバー**: Cloud Run (use Docker image)
- **検索**: Algolia

### 開発ツール

- **コードフォーマット**: Biome
- **テスト**: Vitest + Testing Library
- **ビルド**: Turbo
- **UI 開発**: Storybook

## アーキテクチャ

### ディレクトリ構造

```
src/
├── components/           # UIコンポーネント
│   ├── ui/              # 汎用UIコンポーネント (Tailwind + Radix). never edit files in this directory.
│   ├── pages/           # ページ固有コンポーネント
│   ├── icons/           # アイコンコンポーネント
│   └── ...
├── features/            # 機能別ロジック
│   ├── auth/           # 認証機能
│   ├── posts/          # 投稿機能
│   ├── search/         # 検索機能
│   └── ...
├── stores/             # MobX状態管理(mobx-state-treeを利用)
├── entities/           # データ型定義
├── hooks/              # React hooks (固有ドメインを持たないもの)
├── lib/                # ユーティリティ (固有ドメインを持たないもの)
└── app/               # Next.js ページ
```

## Core Development Rules

1. Package Management
   - ONLY use pnpm, never use npm, yarn
   - Installation: `pnpm install package`
   - Running tools: `pnpm run tool`
   - Upgrading: `pnpm update`

2. Code Quality
   - add type for all code
   - Public APIs must have docstrings
   - Functions must be focused and small
   - Follow existing patterns exactly

3. Testing Requirements
   - Framework: `pnpm test`
   - New features require tests
   - Bug fixes require regression tests

### 必須コマンド

```bash
# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# テスト実行
pnpm test

# Storybook起動
pnpm storybook
```

### リファクタリング後の検証

リファクタリング後は以下を実行して確認：

1. `pnpm build` - ビルドエラーがないか確認
2. `pnpm test` - テストが通るか確認

## 注意事項

### リファクタリング方針

1. **段階的移行**: 一気に全てを変更せず、コンポーネント単位で移行
2. **Radix UI 活用**: Material UI の代替として Shadcn(Radix UI) を採用
3. **Design Token**: Tailwind 設定でカラーパレットを統一管理
4. **型安全性**: class-variance-authority で型安全なバリアント管理

### 依存関係

- **Tailwind CSS v4**: 最新の CSS フレームワーク
- **shadcn/ui**: React + Radix UI ベースのコンポーネントライブラリ
- **Next.js 16**: React 19 対応の最新フレームワーク

### テスト

- Vitest でユニットテスト
- Storybook でコンポーネントテスト
- editor-store.test.ts で MobX ストアのテスト

## Browser Automation

Use `agent-browser` for web automation. Run `agent-browser --help` for all commands.

Core workflow:

1. `agent-browser open <url>` - Navigate to page
2. `agent-browser snapshot -i` - Get interactive elements with refs (@e1, @e2)
3. `agent-browser click @e1` / `fill @e2 "text"` - Interact using refs
4. Re-snapshot after page changes
