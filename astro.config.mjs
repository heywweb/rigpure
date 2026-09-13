// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://rigpure.com',
  output: 'server',
  adapter: cloudflare({
    // Expose les bindings Cloudflare (D1, etc.) en dev local via wrangler
    platformProxy: { enabled: true },
    // Pas de traitement d'image via Cloudflare Images (on sert des <img> statiques / R2)
    imageService: 'passthrough',
  }),
  image: {
    // Images distantes autorisées (avant migration vers /wp-content local)
    remotePatterns: [{ protocol: 'https' }],
  },
});
