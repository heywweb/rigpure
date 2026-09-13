import { sqliteTable, integer, text, uniqueIndex, index } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
});

export const games = sqliteTable('games', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  publisher: text('publisher'),
  releaseDate: text('release_date'),
  platforms: text('platforms'), // JSON array
  cover: text('cover'),
});

export const authors = sqliteTable('authors', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  bio: text('bio'),
  avatar: text('avatar'),
  role: text('role'),
  twitter: text('twitter'),
});

export const articles = sqliteTable(
  'articles',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    dek: text('dek'),
    bodyMd: text('body_md'),
    bodyHtml: text('body_html'),
    categoryId: integer('category_id').notNull().references(() => categories.id),
    gameId: integer('game_id').references(() => games.id),
    authorId: integer('author_id').references(() => authors.id),
    cover: text('cover'),
    coverAlt: text('cover_alt'),
    coverSource: text('cover_source'),
    readingTime: integer('reading_time'),
    rating: text('rating'),        // stocké en texte pour préserver "8.2"
    verdict: text('verdict'),
    pros: text('pros'),            // JSON array
    cons: text('cons'),            // JSON array
    tier: text('tier'),
    publishedAt: text('published_at'),
    updatedAt: text('updated_at'),
    views: integer('views').default(0),
    featured: integer('featured', { mode: 'boolean' }).default(false),
    // SEO
    metaDescription: text('meta_description'),
    ogImage: text('og_image'),
    canonical: text('canonical'),
    noindex: integer('noindex', { mode: 'boolean' }).default(false),
    draft: integer('draft', { mode: 'boolean' }).default(false),
  },
  (t) => ({
    catSlug: uniqueIndex('idx_articles_cat_slug').on(t.categoryId, t.slug),
    byCategory: index('idx_articles_category').on(t.categoryId),
    byPublished: index('idx_articles_published').on(t.publishedAt),
  })
);

export const tags = sqliteTable('tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
});

export const articleTags = sqliteTable(
  'article_tags',
  {
    articleId: integer('article_id').notNull().references(() => articles.id),
    tagId: integer('tag_id').notNull().references(() => tags.id),
  },
  (t) => ({
    pk: uniqueIndex('idx_article_tags_pk').on(t.articleId, t.tagId),
  })
);
