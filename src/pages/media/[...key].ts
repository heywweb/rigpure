import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

const TYPES: Record<string, string> = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp',
  gif: 'image/gif', svg: 'image/svg+xml', avif: 'image/avif',
};

// Sert les médias depuis le bucket R2 (binding MEDIA) à l'URL /media/<key>
export const GET: APIRoute = async ({ params }) => {
  const key = params.key;
  if (!key) return new Response('Not found', { status: 404 });
  const obj = await (env as any).MEDIA.get(key);
  if (!obj) return new Response('Not found', { status: 404 });
  const ext = key.split('.').pop()?.toLowerCase() || '';
  const ct = obj.httpMetadata?.contentType || TYPES[ext] || 'application/octet-stream';
  return new Response(obj.body, {
    headers: { 'Content-Type': ct, 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
