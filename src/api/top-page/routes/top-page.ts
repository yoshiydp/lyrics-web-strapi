import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::top-page.top-page', {
  config: {
    find: { middlewares: ['global::force-published'] },
  },
});
