import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::column.column', {
  config: {
    find: { middlewares: ['global::force-published'] },
    findOne: { middlewares: ['global::force-published'] },
  },
});
