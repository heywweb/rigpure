// Accès données D1 (requêtes SQL préparées)
type DB = D1Database;

// {{categories}} — le skill régénère cette liste depuis blog.config.json.categories (slugs)
export const CATEGORIES = ['guides', 'news', 'reviews', 'setup'] as const;

const ARTICLE_CARD_COLS =
  'a.id, a.slug, a.title, a.dek, a.cover, a.cover_alt, a.reading_time, a.published_at, a.rating, a.tier, c.slug AS catSlug, c.name AS catName';

export async function getCategory(DB: DB, slug: string) {
  return await DB.prepare('SELECT * FROM categories WHERE slug = ?').bind(slug).first();
}

export async function countByCategory(DB: DB, slug: string) {
  const row = await DB.prepare(
    'SELECT COUNT(*) AS n FROM articles a JOIN categories c ON c.id=a.category_id WHERE c.slug=? AND a.draft=0'
  ).bind(slug).first<{ n: number }>();
  return row?.n ?? 0;
}

export async function listByCategory(DB: DB, slug: string, limit = 24, offset = 0) {
  const { results } = await DB.prepare(
    `SELECT ${ARTICLE_CARD_COLS} FROM articles a JOIN categories c ON c.id=a.category_id
     WHERE c.slug=? AND a.draft=0 ORDER BY a.published_at DESC, a.id DESC LIMIT ? OFFSET ?`
  ).bind(slug, limit, offset).all();
  return results;
}

export async function latest(DB: DB, limit = 8) {
  const { results } = await DB.prepare(
    `SELECT ${ARTICLE_CARD_COLS} FROM articles a JOIN categories c ON c.id=a.category_id
     WHERE a.draft=0 ORDER BY a.published_at DESC, a.id DESC LIMIT ?`
  ).bind(limit).all();
  return results;
}

export async function latestInCategory(DB: DB, slug: string, limit = 4) {
  return listByCategory(DB, slug, limit, 0);
}

export async function searchArticles(DB: DB, q: string, limit = 30) {
  const term = `%${q.trim()}%`;
  const { results } = await DB.prepare(
    `SELECT ${ARTICLE_CARD_COLS} FROM articles a JOIN categories c ON c.id=a.category_id
     WHERE a.draft=0 AND (a.title LIKE ?1 OR a.dek LIKE ?1 OR a.body_md LIKE ?1)
     ORDER BY a.published_at DESC, a.id DESC LIMIT ?2`
  ).bind(term, limit).all();
  return results;
}

export async function trending(DB: DB, limit = 4) {
  const { results } = await DB.prepare(
    `SELECT ${ARTICLE_CARD_COLS} FROM articles a JOIN categories c ON c.id=a.category_id
     WHERE a.draft=0 ORDER BY a.views DESC, a.id ASC LIMIT ?`
  ).bind(limit).all();
  return results;
}

export async function listGames(DB: DB, limit = 8) {
  const { results } = await DB.prepare(
    `SELECT g.slug, g.name,
            (SELECT cover FROM articles WHERE game_id=g.id AND cover IS NOT NULL ORDER BY id LIMIT 1) AS cover,
            COUNT(a.id) AS n
     FROM games g LEFT JOIN articles a ON a.game_id=g.id
     GROUP BY g.id ORDER BY n DESC, g.name ASC LIMIT ?`
  ).bind(limit).all();
  return results;
}

export async function getArticle(DB: DB, category: string, slug: string) {
  return await DB.prepare(
    `SELECT a.*, c.slug AS catSlug, c.name AS catName,
            g.name AS gameName, g.slug AS gameSlug, g.publisher AS gamePublisher,
            au.name AS authorName, au.role AS authorRole, au.bio AS authorBio, au.twitter AS authorTwitter
     FROM articles a
     JOIN categories c ON c.id=a.category_id
     LEFT JOIN games g ON g.id=a.game_id
     LEFT JOIN authors au ON au.id=a.author_id
     WHERE c.slug=? AND a.slug=? AND a.draft=0 LIMIT 1`
  ).bind(category, slug).first();
}

export async function relatedArticles(DB: DB, articleId: number, gameId: number | null, limit = 3) {
  if (gameId) {
    const { results } = await DB.prepare(
      `SELECT ${ARTICLE_CARD_COLS} FROM articles a JOIN categories c ON c.id=a.category_id
       WHERE a.game_id=? AND a.id<>? AND a.draft=0 ORDER BY a.published_at DESC LIMIT ?`
    ).bind(gameId, articleId, limit).all();
    if (results.length) return results;
  }
  const { results } = await DB.prepare(
    `SELECT ${ARTICLE_CARD_COLS} FROM articles a JOIN categories c ON c.id=a.category_id
     WHERE a.id<>? AND a.draft=0 ORDER BY a.published_at DESC LIMIT ?`
  ).bind(articleId, limit).all();
  return results;
}
