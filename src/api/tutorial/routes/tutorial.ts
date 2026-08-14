import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::tutorial.tutorial', {
  config: {
    find: { middlewares: ['global::force-published'] },
    findOne: { middlewares: ['global::force-published'] },
  },
});
