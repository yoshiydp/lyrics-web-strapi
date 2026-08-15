import type { Core } from '@strapi/strapi';

/**
 * 公開サイト向けルートで status クエリを published に強制する。
 * Draft & Publish の content type に Public find 権限を付与すると、
 * 未認証でも `?status=draft` で下書きが読めてしまうため（Strapi v5 の仕様）、
 * 公開ルート側で status を上書きして下書きの漏洩を防ぐ。
 * 下書きプレビューが必要になった場合は、認証付きの別ルートとして実装すること。
 */
const forcePublished: Core.MiddlewareFactory = () => {
  return async (ctx, next) => {
    ctx.query.status = 'published';
    await next();
  };
};

export default forcePublished;
