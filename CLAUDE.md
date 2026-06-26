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

### Content API のパブリック権限設定（初回のみ）

管理画面で Public ロールに読み取り権限を付与しないと、API が 403 を返します。  
`yarn develop` 起動後、以下の手順を一度だけ実行してください。

1. `http://localhost:1337/admin` → **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
2. 以下の Content Type それぞれで `find` と `findOne` にチェックを入れる
   - `Author`
   - `Category`
   - `News`
3. **Save** をクリック

> **注意:** この設定はデータベースに保存されるため、新しい環境（STG・本番）では再度同じ手順が必要です。

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
│   ├── admin/
│   │   └── app.tsx     # 管理画面カスタマイズ（ロケール設定など）
│   ├── api/            # Content Type ごとの API 定義
│   │   ├── category/
│   │   ├── author/
│   │   └── news/
│   ├── extensions/     # プラグイン拡張
│   └── index.ts        # エントリーポイント（グローバルフック）
├── types/              # 自動生成された TypeScript 型定義
├── .env                # 環境変数（gitignore 済み）
├── .env.example        # 環境変数テンプレート
└── tsconfig.json
```

---

## Content Type 設計

### 実装済み Content Type

各 Content Type のファイルは `src/api/<name>/` 配下に controller / routes / services / schema.json の形式で定義されています。

#### news（記事）— `src/api/news/`

| フィールド | 型 | 説明 |
|-----------|-----|------|
| title | String (required) | 記事タイトル |
| slug | UID | URL スラッグ（title から自動生成） |
| excerpt | Text | 概要（一覧ページ用） |
| body | Rich Text (Blocks) | 本文 |
| thumbnail | Media (images) | サムネイル画像 |
| publishedAt | DateTime | 公開日時（draftAndPublish: true） |
| category | Relation → category (多対一) | カテゴリー |
| seoTitle | String | SEO タイトル |
| seoDescription | Text | SEO ディスクリプション |

#### category（カテゴリー）— `src/api/category/`

| フィールド | 型 | 説明 |
|-----------|-----|------|
| name | String (required) | カテゴリー名 |
| slug | UID (required) | URL スラッグ |
| news_articles | Relation → news (一対多) | 紐づく記事（逆参照） |

#### author（著者）— `src/api/author/`

| フィールド | 型 | 説明 |
|-----------|-----|------|
| name | String (required) | 著者名 |
| avatar | Media (images) | アバター画像 |

---

## 管理画面の日本語化

`src/admin/app.tsx` で日本語ロケールを有効化しています。

```tsx
// src/admin/app.tsx
export default {
  config: {
    locales: ['ja'],
  },
  bootstrap(_app) {},
};
```

ユーザーごとの言語切り替えは管理画面右上のユーザーメニュー → **Profile** → **Interface language** から行います。

> **注意:** `config/admin.ts` の型定義に `locales` は存在しません。ロケール設定は必ず `src/admin/app.tsx` で行ってください。

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

## ブランチ運用

```
master
  └── develop
        └── feature/xxx   # 作業ブランチ
```

| ブランチ | 役割 |
|---------|------|
| `master` | 本番リリース用。staging で確認済みのものをマージ |
| `staging` | 表示・挙動確認用。develop から適宜マージして使用 |
| `develop` | 開発ベースブランチ。feature ブランチの統合先 |
| `feature/*` | 機能ごとの作業ブランチ |

### 日常の開発フロー

```bash
# 1. develop から feature ブランチを切る
git checkout develop
git checkout -b feature/xxx

# 2. 実装・コミット

# 3. develop へ PR を作成してマージ

# 4. staging で確認したいとき → develop を staging へマージ
git checkout staging
git merge develop
git push origin staging   # Strapi Cloud STG 環境へ自動デプロイ（設定後）

# 5. 本番リリース → staging を master へマージ
git checkout master
git merge staging
git push origin master    # Strapi Cloud 本番環境へ自動デプロイ（設定後）
```

---

## インフラ方針

| 環境 | DB | Strapi ホスティング |
|------|-----|-------------------|
| ローカル | PostgreSQL 16（Homebrew） | `yarn develop` |
| STG | Strapi Cloud 付属 PostgreSQL | Strapi Cloud（`staging` ブランチ） |
| 本番 | Strapi Cloud 付属 PostgreSQL（または RDS） | Strapi Cloud（`master` ブランチ） |

### Strapi Cloud セットアップ（未対応・後回し）

Strapi Cloud への接続は以下のタイミングで行います。

- 継続利用には有料プランが必要（Pro: $29/月〜、staging + production の2環境）
- ローカル開発が安定したタイミングで着手する

**セットアップ時の手順（概要）:**
1. [cloud.strapi.io](https://cloud.strapi.io) でアカウント作成・プロジェクト作成
2. GitHub リポジトリ（`lyrics-web-strapi`）を接続
3. `staging` ブランチ → STG 環境、`master` ブランチ → 本番環境 に設定
4. Strapi Cloud の各環境 URL を `lyrics-web-frontend` の Vercel 環境変数に反映
   ```bash
   # lyrics-web-frontend リポジトリで実行
   vercel env rm NEXT_PUBLIC_STRAPI_URL preview
   echo "https://your-strapi-staging.strapiapp.com" | vercel env add NEXT_PUBLIC_STRAPI_URL preview staging

   vercel env rm NEXT_PUBLIC_STRAPI_URL production
   echo "https://your-strapi-prod.strapiapp.com" | vercel env add NEXT_PUBLIC_STRAPI_URL production
   ```
