import type { APIRoute } from 'astro';

export const GET: APIRoute = (context) => {
  const site = context.site?.href ?? 'https://{{domain}}/';
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    '# AI crawlers welcome (GEO)',
    'User-agent: GPTBot',
    'Allow: /',
    'User-agent: PerplexityBot',
    'Allow: /',
    'User-agent: ClaudeBot',
    'Allow: /',
    '',
    `Sitemap: ${site}sitemap.xml`,
  ].join('\n');
  return new Response(body + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, s-maxage=3600' },
  });
};
