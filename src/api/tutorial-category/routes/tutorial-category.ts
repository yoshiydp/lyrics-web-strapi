import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::tutorial-category.tutorial-category', {
  config: {
    // populate 経由で draft 記事が漏れないよう、カテゴリ側でも status を published に強制する
    find: { middlewares: ['global::force-published'] },
    findOne: { middlewares: ['global::force-published'] },
  },
});
