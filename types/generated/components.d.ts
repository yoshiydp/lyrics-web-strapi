import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsAppScreen extends Struct.ComponentSchema {
  collectionName: 'components_sections_app_screens';
  info: {
    description: '\u30C8\u30C3\u30D7\u30DA\u30FC\u30B8 App Preview \u30BB\u30AF\u30B7\u30E7\u30F3\u306E\u30D5\u30A9\u30F3\u30E2\u30C3\u30AF';
    displayName: 'App Screen';
  };
  attributes: {
    caption: Schema.Attribute.String;
    highlighted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    screenshot: Schema.Attribute.Media<'images'>;
  };
}

export interface SectionsCta extends Struct.ComponentSchema {
  collectionName: 'components_sections_ctas';
  info: {
    description: '\u30C8\u30C3\u30D7\u30DA\u30FC\u30B8 CTA \u30BB\u30AF\u30B7\u30E7\u30F3\uFF08\u30B9\u30C8\u30A2\u30DC\u30BF\u30F3\u306E\u30E9\u30D9\u30EB\u306F\u56FA\u5B9A\u5B9F\u88C5\u3002URL \u3068\u30EA\u30FC\u30C9\u6587\u306E\u307F CMS \u7BA1\u7406\uFF09';
    displayName: 'CTA';
  };
  attributes: {
    appStoreUrl: Schema.Attribute.String;
    googlePlayUrl: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    lead: Schema.Attribute.Text;
  };
}

export interface SectionsFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_faq_items';
  info: {
    description: '\u30C8\u30C3\u30D7\u30DA\u30FC\u30B8 FAQ \u30BB\u30AF\u30B7\u30E7\u30F3\u306E Q&A';
    displayName: 'FAQ Item';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsFeatureItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_feature_items';
  info: {
    description: '\u30C8\u30C3\u30D7\u30DA\u30FC\u30B8 Features \u30BB\u30AF\u30B7\u30E7\u30F3\u306E\u30AB\u30FC\u30C9';
    displayName: 'Feature Item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    label: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'sections.app-screen': SectionsAppScreen;
      'sections.cta': SectionsCta;
      'sections.faq-item': SectionsFaqItem;
      'sections.feature-item': SectionsFeatureItem;
    }
  }
}
