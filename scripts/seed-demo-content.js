/**
 * ローカル確認用のデモ記事シード（News / Tutorial / Column 各 3 件 + カテゴリ）。
 *
 * 文言はデザイン原本（FlexQ Top Page）のダミーコピー。実運用データは管理画面から
 * 投入する前提のため、bootstrap では実行せず手動実行のみとする:
 *
 *   node scripts/seed-demo-content.js
 *
 * 冪等: 既に記事が 1 件でも存在するコレクションはスキップする。
 */
const { createStrapi, compileStrapi } = require('@strapi/strapi');

const paragraph = (text) => [
  { type: 'paragraph', children: [{ type: 'text', text }] },
];

async function ensureCategory(app, uid, name) {
  const existing = await app.documents(uid).findFirst({
    filters: { name: { $eq: name } },
  });
  if (existing) return existing.documentId;
  const created = await app.documents(uid).create({
    data: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
  });
  return created.documentId;
}

async function seedNews(app) {
  if (await app.documents('api::news.news').findFirst()) {
    console.log('news: already has data, skipping');
    return;
  }
  const items = [
    {
      category: 'RELEASE',
      title: 'FlexQ の配信を開始しました',
      excerpt: 'App Store / Google Play にて配信を開始。全機能を無料でご利用いただけます。',
    },
    {
      category: 'UPDATE',
      title: '録音メモの波形表示に対応',
      excerpt: '録音したフレーズを波形で確認しながら再生位置を移動できるようになりました。',
    },
    {
      category: 'EVENT',
      title: 'アーティスト向け先行体験会を開催',
      excerpt: 'シンガー・ラッパーの皆さまを対象に、開発中ビルドの体験会を都内で開催しました。',
    },
  ];
  for (const [i, item] of items.entries()) {
    const categoryId = await ensureCategory(app, 'api::category.category', item.category);
    await app.documents('api::news.news').create({
      status: 'published',
      data: {
        title: item.title,
        slug: `demo-news-${i + 1}`,
        excerpt: item.excerpt,
        body: paragraph(`${item.excerpt}（このデモ記事はローカル確認用です。実データ投入後に削除してください）`),
        category: { connect: [categoryId] },
      },
    });
  }
  console.log('news: seeded 3 demo articles');
}

async function seedTutorials(app) {
  if (await app.documents('api::tutorial.tutorial').findFirst()) {
    console.log('tutorials: already has data, skipping');
    return;
  }
  const categoryId = await ensureCategory(
    app,
    'api::tutorial-category.tutorial-category',
    'BASICS'
  );
  const items = [
    { order: 1, difficulty: 'beginner', title: 'はじめての FlexQ — プロジェクトを作る' },
    { order: 2, difficulty: 'beginner', title: '音源を取り込んで、再生しながら書く' },
    { order: 3, difficulty: 'intermediate', title: '録音メモでフロウを固める' },
  ];
  for (const [i, item] of items.entries()) {
    await app.documents('api::tutorial.tutorial').create({
      status: 'published',
      data: {
        title: item.title,
        slug: `demo-tutorial-${i + 1}`,
        excerpt: 'このデモ記事はローカル確認用です。',
        body: paragraph('このデモ記事はローカル確認用です。実データ投入後に削除してください。'),
        order: item.order,
        difficulty: item.difficulty,
        category: { connect: [categoryId] },
      },
    });
  }
  console.log('tutorials: seeded 3 demo articles');
}

async function seedColumns(app) {
  if (await app.documents('api::column.column').findFirst()) {
    console.log('columns: already has data, skipping');
    return;
  }
  const items = [
    { category: 'CRAFT', title: '韻を「置きにいかない」ためのメモ術' },
    { category: 'PROCESS', title: 'デモ音源とラフの距離感について' },
    { category: 'ESSAY', title: '書けない日の、書き方' },
  ];
  for (const [i, item] of items.entries()) {
    const categoryId = await ensureCategory(
      app,
      'api::column-category.column-category',
      item.category
    );
    await app.documents('api::column.column').create({
      status: 'published',
      data: {
        title: item.title,
        slug: `demo-column-${i + 1}`,
        excerpt: 'このデモ記事はローカル確認用です。',
        body: paragraph('このデモ記事はローカル確認用です。実データ投入後に削除してください。'),
        category: { connect: [categoryId] },
      },
    });
  }
  console.log('columns: seeded 3 demo articles');
}

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  try {
    await seedNews(app);
    await seedTutorials(app);
    await seedColumns(app);
  } finally {
    // destroy 時の DB プール切断エラーはシード結果に影響しないため無視する
    await app.destroy().catch(() => {});
  }
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
