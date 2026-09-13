import type { APIRoute } from 'astro';

// ads.txt — requis par AdSense. Remplacer la ligne ci-dessous par ta vraie ligne
// une fois le compte AdSense validé (pub-XXXX est ton Publisher ID).
export const GET: APIRoute = () => {
  const body = [
    '# ads.txt — RigPure',
    '# TODO: replace with your real AdSense line once your account is approved:',
    '# google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0',
  ].join('\n');
  return new Response(body + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, s-maxage=3600', 'X-Robots-Tag': 'noindex' },
  });
};
