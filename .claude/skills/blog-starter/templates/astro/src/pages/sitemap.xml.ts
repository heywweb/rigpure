import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { CATEGORIES } from '../lib/queries';

export const GET: APIRoute = async (context) => {
  const DB = (env as any).DB as D1Database;
  const site = context.site?.href ?? 'https://{{domain}}/';
  const { results } = await DB.prepare(
    `SELECT a.slug, a.updated_at, a.published_at, c.slug AS catSlug
     FROM articles a JOIN categories c ON c.id=a.category_id WHERE a.draft=0`
  ).all<{ slug: string; updated_at: string; published_at: string; catSlug: string }>();

  const urls: { loc: string; lastmod?: string }[] = [{ loc: site }];
  for (const c of CATEGORIES) urls.push({ loc: `${site}${c}` });
  for (const r of results) {
    urls.push({ loc: `${site}${r.catSlug}/${r.slug}`, lastmod: r.updated_at || r.published_at });
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`)
      .join('\n') +
    `\n</urlset>\n`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=3600' },
  });
};
