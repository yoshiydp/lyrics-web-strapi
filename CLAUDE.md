# CLAUDE.md

このファイルは、リポジトリ内のコードを操作する際に Claude Code (claude.ai/code) へのガイダンスを提供します。

## コマンド

```bash
# 開発サーバー起動（ファイル変更時に自動再起動）
yarn develop        # または yarn dev

# 本番起動（ビルド済みの場合）
yarn start

# 管理画面ビルド
yarn build

# Strapi CLI 直接実行
yarn strapi

# バージョンアップグレード（確認のみ）
yarn upgrade:dry

# バージョンアップグレード（実行）
yarn upgrade
```

管理画面: `http://localhost:1337/admin`

### 管理者アカウント（デモ）

| 項目 | 値 |
|------|---|
| Email | admin@example.com |
| Password | Password123 |

---

## アーキテクチャ

### 技術スタック

| 項目 | 内容 |
|------|------|
| CMS | Strapi v5.47.1（Headless CMS） |
| 言語 | TypeScript |
| DB | PostgreSQL 16 |
| ランタイム | Node.js v22.11.0 |
| パッケージマネージャー | Yarn |

### 関連リポジトリ

| リポジトリ | 役割 |
|-----------|------|
| `lyrics-web-strapi`（本リポジトリ） | Headless CMS バックエンド |
| `lyrics-web-frontend` | Next.js フロントエンド（別リポジトリ） |

---

## ローカル開発環境のセットアップ

### 前提条件

- Node.js v20 以上
- Yarn
- PostgreSQL 16（Homebrew でインストール済み）

### PostgreSQL の起動

PostgreSQL は Homebrew でインストール・管理しています。

```bash
# 起動
brew services start postgresql@16

# 停止
brew services stop postgresql@16

# 状態確認
brew services list | grep postgresql
```

### DB・ユーザーの初回作成

初回セットアップ時のみ実行します（既に作成済みの場合は不要）。

```bash
psql -h 127.0.0.1 -U $(whoami) -d postgres -c "CREATE USER strapi WITH PASSWORD 'strapi';"
psql -h 127.0.0.1 -U $(whoami) -d postgres -c "CREATE DATABASE strapi_dev OWNER strapi;"
```

### 環境変数

`.env` を作成します（`.env.example` をコピーして編集）。

```bash
cp .env.example .env
```

ローカル開発用の `.env` 設定値：

```env
HOST=0.0.0.0
PORT=1337

APP_KEYS=<生成された値>
API_TOKEN_SALT=<生成された値>
ADMIN_JWT_SECRET=<生成された値>
TRANSFER_TOKEN_SALT=<生成された値>
JWT_SECRET=<生成された値>
ENCRYPTION_KEY=<生成された値>

DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=strapi_dev
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
DATABASE_SSL=false
```

> `.env` は `.gitignore` に含まれており、コミットされません。

### 依存関係インストール

```bash
yarn install
```

### 開発サーバー起動

```bash
yarn develop
```

初回起動時は `http://localhost:1337/admin` にアクセスして管理者アカウントを作成してください。

---

## プロジェクト構成

```
lyrics-web-strapi/
├── config/
│   ├── admin.ts        # 管理画面設定
│   ├── api.ts          # API 設定（レスポンス形式など）
│   ├── database.ts     # DB 接続設定（環境変数から読み込み）
│   ├── middlewares.ts  # ミドルウェア設定
│   ├── plugins.ts      # プラグイン設定
│   └── server.ts       # サーバー設定（ホスト・ポートなど）
├── database/
│   └── migrations/     # DB マイグレーションファイル
├── public/
│   └── uploads/        # アップロードファイルの保存先（gitignore 済み）
├── src/
│   ├── admin/          # 管理画面カスタマイズ
│   ├── api/            # Content Type ごとの API 定義
│   ├── extensions/     # プラグイン拡張
│   └── index.ts        # エントリーポイント（グローバルフック）
├── types/              # 自動生成された TypeScript 型定義
├── .env                # 環境変数（gitignore 済み）
├── .env.example        # 環境変数テンプレート
└── tsconfig.json
```

---

## Content Type 設計

### 想定している Content Type（実装予定）

#### news（記事）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| title | String | 記事タイトル |
| slug | UID | URL スラッグ（title から自動生成） |
| excerpt | Text | 概要（一覧ページ用） |
| body | Rich Text (Blocks) | 本文 |
| thumbnail | Media | サムネイル画像 |
| publishedAt | DateTime | 公開日時（Strapi 標準） |
| category | Relation (category) | カテゴリー（多対一） |
| seoTitle | String | SEO タイトル |
| seoDescription | Text | SEO ディスクリプション |

#### category（カテゴリー）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| name | String | カテゴリー名 |
| slug | UID | URL スラッグ |

#### author（著者）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| name | String | 著者名 |
| avatar | Media | アバター画像 |

---

## フロントエンドとの連携

### API エンドポイント（REST）

Strapi が自動生成する REST API を Next.js から利用します。

```
# 記事一覧
GET http://localhost:1337/api/news?populate=*&sort=publishedAt:desc

# 記事詳細（スラッグ指定）
GET http://localhost:1337/api/news?filters[slug][$eq]={slug}&populate=*
```

### GraphQL（将来的に導入予定）

現時点は REST API で進めます。over-fetch が問題になった段階で `@strapi/plugin-graphql` の導入を検討します。

---

## インフラ方針

| 環境 | DB | Strapi ホスティング |
|------|-----|-------------------|
| ローカル | PostgreSQL 16（Homebrew） | `yarn develop` |
| STG | Strapi Cloud 付属 PostgreSQL | Strapi Cloud |
| 本番 | Strapi Cloud 付属 PostgreSQL（または RDS） | Strapi Cloud（または EC2） |
