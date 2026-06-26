# lyrics-web-strapi

企業向けコンテンツサイトのバックエンド CMS です。  
Strapi v5 と PostgreSQL で構築した Headless CMS で、Next.js フロントエンドに REST API を提供します。

## 技術スタック

| 項目 | 内容 |
|------|------|
| CMS | Strapi v5 |
| 言語 | TypeScript |
| DB | PostgreSQL 16 |
| ホスティング | Strapi Cloud（予定） |
| フロントエンド | Next.js（[lyrics-web-frontend](https://github.com/yoshiydp/lyrics-web-frontend)） |

## 関連リポジトリ

| リポジトリ | 役割 |
|-----------|------|
| `lyrics-web-strapi`（本リポジトリ） | Headless CMS バックエンド |
| `lyrics-web-frontend` | Next.js フロントエンド |

## Content Type

| 名前 | 説明 |
|------|------|
| `news` | 記事（タイトル・スラッグ・本文・サムネイル・カテゴリー・SEO） |
| `category` | カテゴリー（名前・スラッグ） |
| `author` | 著者（名前・アバター） |

## ローカル開発

### 前提条件

- Node.js v20 以上
- Yarn
- PostgreSQL 16（Homebrew でインストール済み）

### セットアップ

```bash
# 1. PostgreSQL を起動
brew services start postgresql@16

# 2. DB・ユーザーを作成（初回のみ）
psql -h 127.0.0.1 -U $(whoami) -d postgres -c "CREATE USER strapi WITH PASSWORD 'strapi';"
psql -h 127.0.0.1 -U $(whoami) -d postgres -c "CREATE DATABASE strapi_dev OWNER strapi;"

# 3. 依存関係インストール
yarn install

# 4. 環境変数を作成
cp .env.example .env

# 5. 開発サーバー起動
yarn develop
```

管理画面: `http://localhost:1337/admin`

### 環境変数

`.env.example` をコピーして `.env` を作成してください。

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

FRONTEND_URLS=http://localhost:3000
```

### Content API のパブリック権限設定（初回のみ）

`yarn develop` 起動後、管理画面で以下を設定してください。

1. **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
2. `Author` / `Category` / `News` それぞれで `find` と `findOne` にチェック
3. **Save**

## API エンドポイント

```
# ニュース一覧
GET /api/news?populate=*&sort=publishedAt:desc

# ニュース詳細（スラッグ指定）
GET /api/news?filters[slug][$eq]={slug}&populate=*

# カテゴリー一覧
GET /api/categories?populate=*
```

## デプロイ

Strapi Cloud への自動デプロイを予定しています（セットアップは後回し）。

| ブランチ | デプロイ先 |
|---------|-----------|
| `master` | Strapi Cloud 本番環境 |
| `staging` | Strapi Cloud STG 環境 |
