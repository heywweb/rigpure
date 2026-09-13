import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { CATEGORIES } from '../lib/queries';

// llms.txt — plan lisible par les IA (GEO). Liste les contenus clés par catégorie.
export const GET: APIRoute = async (context) => {
  const DB = (env as any).DB as D1Database;
  const site = context.site?.href ?? 'https://rigpure.com/';
  const lines: string[] = [
    '# RigPure',
    '',
    '> PC gaming reviews, guides and news. Hands-on expertise from real players — we play, we test every game we cover.',
    '',
  ];
  for (const cat of CATEGORIES) {
    const { results } = await DB.prepare(
      `SELECT a.slug, a.title, a.dek, c.name AS catName FROM articles a JOIN categories c ON c.id=a.category_id
       WHERE c.slug=? AND a.draft=0 ORDER BY a.published_at DESC`
    ).bind(cat).all<{ slug: string; title: string; dek: string; catName: string }>();
    if (!results.length) continue;
    lines.push(`## ${results[0].catName}`);
    for (const r of results) {
      lines.push(`- [${r.title}](${site}${cat}/${r.slug})${r.dek ? `: ${r.dek}` : ''}`);
    }
    lines.push('');
  }
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, s-maxage=3600', 'X-Robots-Tag': 'noindex' },
  });
};
