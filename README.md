# Hagetter

![donmi](public/images/donmi_kusa.png)

Hagetter は Mastodon 投稿のための Togetter ライクなプラットフォームです。

## 開発

### 前提条件

- Node.js 18+
- pnpm

### セットアップ

1. 依存関係をインストール:

   ```bash
   pnpm install
   ```

2. 環境変数をコピー:

   ```bash
   cp exsample.env .env
   ```

3. 開発サーバーを起動:
   ```bash
   pnpm dev
   ```

### コマンド

- `pnpm dev` - 開発サーバーを起動
- `pnpm build` - 本番用ビルド
- `pnpm test` - テスト実行
- `pnpm storybook` - Storybook を起動

## 技術スタック

- **フロントエンド**: Next.js 15, TypeScript, Tailwind CSS v4
- **UI**: shadcn/ui, Radix UI
- **状態管理**: MobX State Tree
- **バックエンド**: Firebase Firestore
- **検索**: Algolia
- **デプロイ**: Cloud Run, CloudFlare CDN
