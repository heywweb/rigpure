// Import des articles Markdown -> seed.sql (D1) + téléchargement des images (style WordPress)
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import sharp from 'sharp';

// Covers are re-encoded to WebP and cropped to this fixed size (16:9, matching
// the site's screenshot-sourced covers) so every cover — game header, icon or
// screenshot — is uniform. CSS then scales the result fluidly for every viewport.
const COVER_WIDTH = 1600;
const COVER_HEIGHT = 900;

// Chemins relatifs au projet — lancer ce script depuis la racine du projet Astro.
const ROOT = process.cwd();
const CONTENTS = path.join(ROOT, 'contents');
const pad = (n) => String(n).padStart(2, '0');
const now = new Date();
const UPLOAD_REL = `/wp-content/uploads/${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())}`;
const UPLOAD_DIR = path.join(ROOT, 'public', UPLOAD_REL);
const OUT_SQL = path.join(ROOT, 'seed.sql');

const CATS = [
  { slug: 'games', name: 'Games', description: 'Profiles of the PC games we cover — genre, platforms and what makes them worth playing.' },
  { slug: 'reviews', name: 'Reviews', description: 'Hands-on reviews with a clear verdict and score.' },
  { slug: 'guides', name: 'Guides', description: 'In-depth guides, how-tos and progression tips.' },
  { slug: 'news', name: 'News', description: 'Latest news: announcements, updates and events.' },
];

const q = (v) => (v === null || v === undefined ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`);
const qbool = (v) => (v ? 1 : 0);
const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

async function download(url, filename) {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    // SVGs stay vector (already device-scalable, re-encoding would only rasterize them).
    if (/\.svg$/i.test(filename)) {
      fs.writeFileSync(path.join(UPLOAD_DIR, filename), buf);
      return `${UPLOAD_REL}/${filename}`;
    }
    const webp = await sharp(buf)
      .resize({ width: COVER_WIDTH, height: COVER_HEIGHT, fit: 'cover', position: 'attention' })
      .webp({ quality: 82 })
      .toBuffer();
    const webpFilename = filename.replace(/\.[a-z0-9]+$/i, '.webp');
    fs.writeFileSync(path.join(UPLOAD_DIR, webpFilename), webp);
    return `${UPLOAD_REL}/${webpFilename}`;
  } catch (e) {
    console.warn(`  ! image KO (${filename}): ${e.message} — on garde l'URL distante`);
    return null;
  }
}

function extOf(url) {
  const clean = url.split('?')[0];
  const m = clean.match(/\.(jpg|jpeg|png|webp|gif|svg|avif)$/i);
  return m ? m[0].toLowerCase() : '.jpg';
}

const games = new Map(); // slug -> name
const tags = new Map();  // slug -> name
const articles = [];

for (const cat of CATS) {
  const dir = path.join(CONTENTS, cat.slug);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const { data, content } = matter(raw);
    const slug = data.slug || file.replace(/\.md$/, '');
    const gameSlug = data.game ? slugify(data.game) : null;
    if (gameSlug) games.set(gameSlug, data.game);
    const tagList = Array.isArray(data.tags) ? data.tags : [];
    for (const t of tagList) {
      const ts = String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      if (ts) tags.set(ts, String(t));
    }
    articles.push({ ...data, slug, category: cat.slug, body_md: content, tagList, gameSlug });
  }
}

// Téléchargement des covers
console.log('Téléchargement des images...');
for (const a of articles) {
  if (a.cover && /^https?:\/\//.test(a.cover)) {
    const filename = `${a.slug}-${a.category}${extOf(a.cover)}`;
    const local = await download(a.cover, filename);
    if (local) { a.cover = local; }
  }
  a.og_image = a.og_image || a.cover;
}

// Construction du SQL
const lines = [];
lines.push('PRAGMA foreign_keys=OFF;');
lines.push('DELETE FROM article_tags; DELETE FROM articles; DELETE FROM tags; DELETE FROM games; DELETE FROM authors; DELETE FROM categories;');

// Categories
CATS.forEach((c, i) => {
  lines.push(`INSERT INTO categories (id,slug,name,description) VALUES (${i + 1},${q(c.slug)},${q(c.name)},${q(c.description)});`);
});
const catId = Object.fromEntries(CATS.map((c, i) => [c.slug, i + 1]));

// Auteur principal — depuis blog.config.json.authors[0]
lines.push(`INSERT INTO authors (id,slug,name,bio,avatar,role,twitter) VALUES (1,'alex','Alex','PC gaming reviewer — plays and tests every title covered before writing.',NULL,'Editor',NULL);`);

// Games
const gameId = {};
[...games.keys()].sort().forEach((slug, i) => {
  gameId[slug] = i + 1;
  lines.push(`INSERT INTO games (id,slug,name) VALUES (${i + 1},${q(slug)},${q(games.get(slug))});`);
});

// Tags
const tagId = {};
[...tags.keys()].sort().forEach((slug, i) => {
  tagId[slug] = i + 1;
  lines.push(`INSERT INTO tags (id,slug,name) VALUES (${i + 1},${q(slug)},${q(tags.get(slug))});`);
});

// Articles
let aid = 0;
for (const a of articles) {
  aid++;
  const bodyHtml = marked.parse(a.body_md || '');
  const pros = a.pros ? JSON.stringify(a.pros) : null;
  const cons = a.cons ? JSON.stringify(a.cons) : null;
  const rating = (a.rating === 0 || a.rating) ? String(a.rating) : null;
  lines.push(
    `INSERT INTO articles (id,slug,title,dek,body_md,body_html,category_id,game_id,author_id,cover,cover_alt,cover_source,video_url,reading_time,rating,verdict,pros,cons,tier,published_at,updated_at,views,featured,meta_description,og_image,canonical,noindex,draft) VALUES (` +
    `${aid},${q(a.slug)},${q(a.title)},${q(a.dek)},${q(a.body_md)},${q(bodyHtml)},${catId[a.category]},` +
    `${gameId[a.gameSlug] ?? 'NULL'},1,${q(a.cover)},${q(a.cover_alt)},${q(a.cover_source)},${q(a.video)},` +
    `${a.reading_time ?? 'NULL'},${q(rating)},${q(a.verdict)},${q(pros)},${q(cons)},${q(a.tier)},` +
    `${q(a.date)},${q(a.date)},0,${qbool(a.featured)},${q(a.meta_description || a.dek)},${q(a.og_image)},NULL,0,${qbool(a.draft)});`
  );
  for (const t of a.tagList) {
    const ts = String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (tagId[ts]) lines.push(`INSERT INTO article_tags (article_id,tag_id) VALUES (${aid},${tagId[ts]});`);
  }
}

lines.push('PRAGMA foreign_keys=ON;');
fs.writeFileSync(OUT_SQL, lines.join('\n'));
console.log(`\nOK : ${articles.length} articles, ${games.size} jeux, ${tags.size} tags -> ${OUT_SQL}`);
