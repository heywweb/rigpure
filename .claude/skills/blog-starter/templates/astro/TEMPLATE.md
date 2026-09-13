# templates/astro — squelette de projet paramétrable

Squelette du site **Astro + Cloudflare** (SSR sur Workers, D1/R2/KV), dérivé de
l'implémentation de référence. Il est **paramétré par placeholders** : le skill les
remplace depuis `blog.config.json` **avant** tout `npm run build`.

> ⚠️ Ces fichiers contiennent des `{{placeholders}}` (y compris dans le JSX des `.astro`).
> Ils ne compilent **pas** en l'état : la substitution doit précéder le build.

## Placeholders

| Placeholder | Source (blog.config.json) | Exemple |
|---|---|---|
| `{{brand}}` | `brand` | `BlogStarter` |
| `{{niche}}` | `niche` | `specialty coffee brewing` |
| `{{slug}}` | slug de `brand` (kebab-case) | `blogstarter` |
| `{{domain}}` | `domain` | `votreblog.com` |
| `{{language}}` | `language` | `en` |
| `{{author}}` | `authors[0].name` | `Alex` |
| `{{authorSlug}}` | slug de `authors[0].name` | `alex` |
| `{{authorBio}}` | `authors[0].bio` | `…` |
| `{{categories}}` | `categories[]` | régénère les tableaux nav / liens / INSERT |
| `<VOTRE_DATABASE_ID>` | créé au déploiement (`wrangler d1 create`) | — |
| `<VOTRE_KV_NAMESPACE_ID>` | créé au déploiement (`wrangler kv namespace create`) | — |
| `GTM-XXXXXXX` (vars) | votre conteneur GTM (optionnel) | — |

`{{categories}}` marque les endroits **structurels** (un item par catégorie) :
`src/components/Header.astro`, `src/components/Footer.astro`, `src/pages/index.astro`,
`scripts/import-content.mjs`, `seed.example.sql`.

## Couleur d'accent

`src/styles/styles-v2.css` définit l'accent en tête (tokens `--volt*`, défaut **#03A9F4**),
puis tout le CSS y référence `var(--volt)`. Pour changer de thème : régénérer ces tokens
avec `scripts/gen-theme.mjs` (dans le bundle du skill) ou éditer les 7 lignes en tête.

## Scaffold (résumé — détail en réf. 06)

```bash
# 1. Substituer les placeholders depuis blog.config.json (le skill le fait)
# 2. Installer + adapter Cloudflare
npm install
# 3. Base de données locale + migrations + seed
npx wrangler d1 migrations apply <NOM_DB> --local
node scripts/import-content.mjs          # contents/*.md -> seed.sql
npx wrangler d1 execute <NOM_DB> --local --file=seed.sql
# 4. Dev
npm run dev
```

## Structure attendue du projet

```
<projet>/
├── src/            components, layouts, pages, lib, db, styles
├── scripts/        import-content.mjs
├── migrations/     schéma D1 (Drizzle)
├── public/         favicon + wp-content/uploads (images générées à l'import)
├── contents/       vos articles Markdown (source de l'import) — à créer
├── seed.sql        généré par l'import
├── astro.config.mjs · wrangler.jsonc · drizzle.config.ts · package.json
```

## Garde-fous
- `database_id` / `kv id` restent des **placeholders** : ils sont créés au déploiement (réf. 09).
- Les pages `legal-notice`, `privacy`, `cookies` contiennent des mentions à **compléter**
  (raison sociale, DPO…). Ne pas publier sans les remplir.
- `import-content.mjs` se lance **depuis la racine du projet** (`ROOT = process.cwd()`).
