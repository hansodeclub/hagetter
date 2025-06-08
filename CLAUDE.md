# Development Guideline

## プロジェクト概要

Hagetter は Mastodon 向けの Togetter ライクなポストまとめプラットフォームで、Next.js + TypeScript + Firebase で構築されています。現在 Material UI から Tailwind CSS へのリファクタリングを進行中です。

## 技術スタック

### フロントエンド

- **フレームワーク**: Next.js 15
- **言語**: TypeScript
- **スタイリング**:
  - **移行中**: Material UI 5.16.14 → Tailwind CSS 3.4.17
  - **UI ライブラリ**: shadcn, Radix UI (新規採用)
  - **スタイル管理**: clsx, tailwind-merge
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
│   ├── ui/              # 汎用UIコンポーネント (Tailwind + Radix)
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
└── pages/              # Next.js ページ
```

## リファクタリング状況

### 完了済み

- ✅ Tailwind CSS 設定 (tailwind.config.ts)
- ✅ shadcn/ui ベース UI コンポーネント導入
- ✅ 新規コンポーネントの Tailwind 化
- ✅ `src/components/text-formatter/text-formatter.tsx` (Grid, Divider 削除)
- ✅ `src/components/pages/editor/text-format-selector.tsx` (Grid, ToggleButton 削除)
- ✅ `src/components/pages/editor/items/insert-divider.tsx` (Box, IconButton, Fade 削除)

### 進行中 (Material UI 残存箇所)

以下のファイルで Material UI が残存しています：

1. **テキストフォーマット関連** - 完了

2. **エディター機能**

   - `src/components/pages/editor/items/item.tsx`
   - `src/components/pages/editor/menus/multi-select-menu.tsx`
   - `src/components/pages/editor/menus/buttons.tsx`
   - `src/components/pages/editor/edit-items/text-edit.tsx`

3. **サイドパネル**

   - `src/components/pages/editor/side-panel/timeline.tsx`
   - `src/components/pages/editor/side-panel/search-timeline.tsx`
   - `src/components/pages/editor/side-panel/url-search-timeline.tsx`

4. **その他**
   - `src/components/pages/entries/entries-page.tsx`
   - `src/components/error-notification.tsx`
   - `src/pages/_document.tsx` (Emotion 設定)
   - `src/pages/_app.tsx` (Emotion 設定)

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

### 依存関係の注意

- Material UI 関連の依存関係は移行完了後に削除予定
- Emotion も同時に削除予定 (現在は Material UI との互換性で残存)

### テスト

- Vitest でユニットテスト
- Storybook でコンポーネントテスト
- editor-store.test.ts で MobX ストアのテスト

## 🚨 修正すべき重要な問題点

### 🔴 緊急度：高

#### 1. **バンドルサイズの肥大化**

- **問題**: node_modules が 3.1GB と異常に巨大
- **原因**: Material UI + Tailwind CSS + Emotion の混在
- **影響**: 開発効率低下、デプロイ時間増加
- **対策**: Material UI 完全削除、Tree Shaking 最適化

#### 2. **型安全性の欠如**

- **問題**:
  - TypeScript strict モードが無効 (`"strict": false`)
  - 22 ファイルで`any`型を使用
  - 型推論が効かない箇所が多数
- **影響**: ランタイムエラーのリスク、開発時のバグ発見率低下
- **対策**: strict モード有効化、any 型の段階的削除

#### 3. **セキュリティリスク**

- **問題**:
  - LocalStorage に認証トークンを直接保存 (`session-store.ts:23`)
  - 環境変数ファイル名に typo (`exsample.env` → `example.env`)
  - 設定ファイル内に typo (`Ecnryption Key`)
- **影響**: XSS によるトークン盗用リスク
- **対策**: HttpOnly Cookie 使用、環境変数整理

#### 4. **テストカバレッジ不足**

- **問題**: テストファイルが 1 つのみ (`editor-store.test.ts`)
- **影響**: リファクタリング時の安全性確保困難
- **対策**: 重要機能のテスト追加

### 🟡 緊急度：中

#### 5. **アーキテクチャの問題**

- **巨大ファイルの存在**:
  - `hagetterApiClient.ts` (356 行)
  - `editor-store.ts` (305 行)
  - 単一責任原則違反
- **状態管理の複雑性**: MobX State Tree の適切な分割不足
- **API 設計の非一貫性**: REST API と GraphQL 的アプローチの混在

#### 6. **コード品質の問題**

- **デバッグコードの残存**: 21 ファイルで`console.log/warn/error`
- **未解決タスク**: 9 ファイルで`TODO/FIXME/HACK`コメント
- **古い JavaScript ファイル**: TypeScript 移行が不完全

#### 7. **パフォーマンス問題**

- **画像最適化不足**: Next.js Image コンポーネント未使用箇所
- **バンドル分割不足**: Dynamic Import の活用不足
- **古い ES5 ターゲット**: `"target": "es5"` (モダンブラウザなら`"es2020"`推奨)

### 🟢 緊急度：低

#### 8. **開発体験の問題**

- **設定の非最適化**:
  - Biome 設定で一部ルールが無効化
  - TypeScript 設定が保守的すぎる
- **ドキュメント不足**: API 仕様書、コンポーネント仕様書なし

## 💡 推奨修正順序

### フェーズ 1: 基盤安定化 (1-2 週間)

1. ✅ TypeScript strict モード有効化
2. ✅ セキュリティ問題修正 (認証トークン保存方法)
3. ✅ Material UI 完全削除
4. ✅ 環境変数整理

### フェーズ 2: アーキテクチャ改善 (2-3 週間)

1. ✅ 巨大ファイル分割 (`hagetterApiClient.ts`, `editor-store.ts`)
2. ✅ API 設計統一
3. ✅ エラーハンドリング統一
4. ✅ 重要機能のテスト追加

### フェーズ 3: パフォーマンス最適化 (1-2 週間)

1. ✅ バンドル最適化 (Tree Shaking, Code Splitting)
2. ✅ 画像最適化
3. ✅ TypeScript 設定最適化
4. ✅ 不要な console.log 除去

## 今後のタスク

1. 残存 Material UI コンポーネントの Tailwind 化
2. Emotion 関連コードの削除
3. Material UI 依存関係の削除
4. パフォーマンス最適化
5. デザインシステムの整理
