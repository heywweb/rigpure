import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

const esc = (s: string) =>
  (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async (context) => {
  const DB = (env as any).DB as D1Database;
  const site = context.site?.href ?? 'https://{{domain}}/';
  const { results } = await DB.prepare(
    `SELECT a.slug, a.title, a.dek, a.published_at, c.slug AS catSlug
     FROM articles a JOIN categories c ON c.id=a.category_id
     WHERE a.draft=0 ORDER BY a.published_at DESC, a.id DESC LIMIT 30`
  ).all<{ slug: string; title: string; dek: string; published_at: string; catSlug: string }>();

  const items = results
    .map((r) => {
      const link = `${site}${r.catSlug}/${r.slug}`;
      const pub = r.published_at ? new Date(r.published_at + 'T00:00:00Z').toUTCString() : '';
      return `    <item>\n      <title>${esc(r.title)}</title>\n      <link>${link}</link>\n      <guid>${link}</guid>\n      <description>${esc(r.dek)}</description>\n      ${pub ? `<pubDate>${pub}</pubDate>` : ''}\n    </item>`;
    })
    .join('\n');

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0"><channel>\n` +
    `  <title>{{brand}}</title>\n  <link>${site}</link>\n  <description>Guides, news and reviews for live-service games.</description>\n  <language>en</language>\n` +
    items +
    `\n</channel></rss>\n`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=3600' },
  });
};
