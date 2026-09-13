# BLOGSTARTER — FAITS DU BUILD (source de vérité pour la rédaction de la doc)

> Ce fichier consigne CE QUI A RÉELLEMENT ÉTÉ FAIT. La doc doit s'y tenir, en profondeur.
> Les agents doivent AUSSI lire les vrais fichiers du projet (indiqués par partie) pour
> reproduire les vrais extraits de code/commandes. Racine projet : /Users/you/blogstarter

## Contexte global
- Marque : **BlogStarter** (votreblog.com). Blog/média **gaming en anglais**, auteur/persona : **Alex**.
- Modèle : média gaming monétisé (display/RSoC + affiliation + offres jeux CPI), logique d'ad-arbitrage
  (« vitesse = marge par visiteur »), inspiration **Prydwen** (guides de jeux live-service).
- **4 catégories** : Guides · News · Reviews · Setup.
- Principe directeur ABSOLU : **le design system est la source de vérité unique**. Toute modif d'une
  page passe D'ABORD par le design system (styles-v2.css), puis se répercute.

## Stack & versions réelles
- Node 24, npm 11. Outils dispo : wrangler ^4.125, gh CLI 2.92 (authentifié compte GitHub « username »),
  cwebp/dwebp (WebP), sips (macOS).
- Astro **^7.2.6** (⚠ l'API runtime se comporte comme « Astro v6 » — voir pièges), @astrojs/cloudflare **^14.2.4**,
  drizzle-orm **^0.45**, drizzle-kit **^0.31**, gray-matter, marked.

## Arborescence du projet
```
gaming/
├── design/                 # maquettes HTML validées + styles-v2.css (SOURCE DE VÉRITÉ du design)
│   ├── styles-v2.css        # tokens + composants « Command HUD »
│   ├── design-system-v2.html# styleguide navigable
│   ├── article-v3.html      # gabarit article single (guide/build) audité v3
│   ├── article-news.html    # gabarit article single (news) : hero 2 colonnes + pub carrée
│   ├── listing.html         # gabarit archive (catégorie/tag/auteur)
│   └── home.html            # gabarit accueil
├── contents/               # contenu source : {guides,news,reviews,setup}/*.md (30 articles) + _images.json
├── wp-content/uploads/2026/08/24/   # images style WordPress (covers d'articles)
├── site/                   # PROJET ASTRO (l'app déployée)
│   ├── astro.config.mjs · wrangler.jsonc · drizzle.config.ts · seed.sql
│   ├── media-src/ads/*.webp # créatives pub source (uploadées sur R2)
│   ├── migrations/          # migration D1 générée par drizzle-kit
│   ├── scripts/import-content.mjs
│   ├── public/wp-content/…  # covers copiées (servies en statique)
│   └── src/
│       ├── styles/styles-v2.css   # COPIE du design system (importée 1x dans BaseLayout)
│       ├── db/schema.ts           # schéma Drizzle (D1)
│       ├── lib/{db,queries,util}.ts
│       ├── layouts/BaseLayout.astro
│       ├── components/{Header,Footer,ArticleCard,AdLeaderboard,AdRectangle}.astro
│       └── pages/{index, [category]/index, [category]/[slug], 404, legal-notice, privacy, cookies}.astro
│                 + endpoints {sitemap.xml, robots.txt, ads.txt, llms.txt, rss.xml}.ts + media/[...key].ts
├── .claude/agents/         # agents rédacteurs (guide/news/review-writer, photo-finder)
├── Dev Book/               # CHECKLIST.csv/.md, todo-list.txt
└── documentation/          # CETTE doc
```

## PARTIE 02 — Design system (lire : design/styles-v2.css, design/design-system-v2.html)
- V1 rejetée : trop « SaaS sombre générique » (coins arrondis, violet+cyan safe). Leçon : il faut un **parti pris fort**.
- V2 « **Command HUD** » : esthétique HUD/esport. Dark quasi-noir (--bg #07080b), **accent signature unique = volt
  #03A9F4** (discipline mono-accent), formes angulaires (clip-path « notch », crochets de viseur), grille blueprint
  en fond, typo **Chakra Petch** (titres) + **Inter** (lecture) + **JetBrains Mono** (labels).
- Tokens dans `:root` (surfaces, volt, sémantiques, tiers S→D, typo, espacements, rayons quasi nuls).
- Composants : boutons, badges/tags/tiers, jauges de stats + note, cartes article, encarts pub, fil d'Ariane,
  callouts, sommaire (TOC), bloc auteur (E-E-A-T), table, pagination, header, footer, puis étendus : méga-menu,
  nav mobile, recherche, barre d'annonce, spotlight, hub header, trending, game cards, newsletter, **tier list
  complète**, carte perso, loadout, pros/cons, infos-clés, patch notes, config PC, countdown/roadmap, prose,
  verdict, FAQ, sources, ancre pub, buy box, formulaires, filtres, tabs, cookie banner, 404, modale, toast,
  skeleton, empty, tooltip, résumé « at-a-glance », etc. Priorités 🟢 Essentiel / 🟡 Recommandé / ⚪ Optionnel.
- Styleguide = page unique navigable (sommaire latéral + scrollspy) montrant tokens + composants → à VALIDER avant la suite.
- Marque : logo « BLOG»(blanc)/«STARTER»(couleur d'accent) + pictogramme (SVG).

## PARTIE 03 — Gabarits validés dans l'ordre (lire : design/article-v3.html, article-news.html, listing.html, home.html)
- Ordre : **article → listing → home**. À chaque fois assemblés à partir des composants du DS (aucun style hors DS).
- Article : audité en expert UX/UI. Améliorations v3 : module **« at-a-glance »** (verdict + stats + infos-clés réunis
  en un coup d'œil, standard Prydwen/Mobalytics), utilitaire `.flow` (rythme vertical systématique), **1re pub
  repoussée après 2 sections**, sidebar remontée en mobile + **ancre pub**, scrollspy + barre de progression réels,
  accessibilité (aria). **DEUX gabarits article DISTINCTS coexistent** (ils partagent les composants du DS, pas la
  mise en page) : (a) `article-v3.html` = guide/build (announce-bar, hero pleine largeur, at-a-glance, pros/cons,
  **sommaire d'abord / pub en bas**, 1re pub après 2 sections) ; (b) `article-news.html` = news (bandeau leaderboard
  en haut, **hero 2 colonnes** contenu gauche + pub carrée droite, image dans la prose, sidebar **« pub d'abord puis
  sommaire »**, ancre pub en bas, 1re pub après **1** section). Pour les reviews : bloc verdict/note + pros/cons.
- Listing : template unique réutilisable **catégorie / tag / auteur** (classes `.hub-header`, `.hub-header.is-tag`,
  `.hub-header.is-author`). En-tête d'archive + grille 2 colonnes + **pub in-feed** dans le flux + sidebar tendances + pagination.
- Home : spotlight « à la une » (feature = titre seul, sur demande), « games covered » (grid 4), derniers guides + news,
  sidebar tendances, newsletter.
- Règle d'or répétée : modifier une page = modifier d'abord le DS.

## PARTIE 04 — Modèle de contenu (lire : contents/guides/war-thunder.md, contents/_images.json)
- 1 fichier Markdown par article, avec **frontmatter YAML** : title, slug, category, game, author (Alex), date,
  dek, cover, cover_alt, cover_source, tags, reading_time ; + rating/verdict/pros/cons (reviews), tier (guides).
- Convention d'images **WordPress** : `wp-content/uploads/AAAA/MM/JJ/` (portabilité, URLs stables).
- Règle images : **toujours optimiser + nettoyer les métadonnées avant stockage**. Outils : `cwebp` (WebP, strippe
  TOUTES les métadonnées par défaut → utilisé pour les créatives pub), `sips` (redimensionne mais laisse un bloc vide
  « Photoshop 3.0 » et parfois du XMP). Chaîne de strip total pour un JPEG : `cwebp → dwebp → sips`. Vérif :
  `strings fichier | grep -iE "xmp|c2pa|openai|adobe|FBMD"`.

## PARTIE 05 — Agents rédacteurs (lire : .claude/agents/blogstarter-guide-writer.md, blogstarter-photo-finder.md)
- Un **expert par catégorie** : guide-writer (guides pratiques/tier/build), news-writer (actu factuelle),
  review-writer (test + note + pros/cons), + **photo-finder** (cherche images en ligne, écrit contents/_images.json).
- Définis dans `.claude/agents/*.md` (frontmatter name/description/tools/model + prompt système). ⚠ PIÈGE : les
  agents personnalisés ne sont PAS reconnus en cours de session (registre chargé au démarrage). Contournement :
  lancer des agents **general-purpose** en leur donnant le même prompt expert. Ils restent réutilisables la session suivante.
- Orchestration : le **main loop = chef d'orchestre** (un sous-agent ne peut pas piloter d'autres sous-agents). Pipeline :
  1) photo-finder → contents/_images.json (3 images/jeu, HTTP 200 vérifié) ; 2) 6 rédacteurs en parallèle (2 par
  catégorie, 5 jeux chacun) qui LISENT _images.json et écrivent contents/<cat>/<slug>.md ; images assignées par index
  (0=guides, 1=news, 2=reviews). Contenu **en anglais**, auteur Alex.
- Articles de test : **10 jeux × 3 catégories = 30 articles** (setup laissé vide). Jeux : Arknights: Endfield, NTE,
  Star Trek Fleet Command, Rise of Kingdoms, Raid: Shadow Legends, Project Entropy, Enlisted, War Thunder, Once Human, Where Winds Meet.

## PARTIE 06 — Adaptation Astro (lire : site/astro.config.mjs, wrangler.jsonc, drizzle.config.ts, src/db/schema.ts,
##   src/lib/queries.ts, src/lib/util.ts, scripts/import-content.mjs, src/layouts/BaseLayout.astro,
##   src/components/*.astro, src/pages/index.astro, src/pages/[category]/index.astro, src/pages/[category]/[slug].astro)
- Scaffold (commandes réelles) :
  `npm create astro@latest site -- --template minimal --typescript strict --no-git --install --skip-houston --yes`
  puis `npx astro add cloudflare --yes` puis `npm install drizzle-orm` et `npm install -D drizzle-kit gray-matter marked`.
- astro.config.mjs : `site:'https://votreblog.com'`, `output:'server'`,
  `adapter: cloudflare({ platformProxy:{enabled:true}, imageService:'passthrough' })`, `image.remotePatterns`.
- wrangler.jsonc : name « blogstarter », `main:'@astrojs/cloudflare/entrypoints/server'`, assets binding ASSETS,
  d1_databases (binding DB, database_name blogstarter-db, migrations_dir migrations), r2_buckets (binding MEDIA,
  bucket blogstarter-media), kv_namespaces (binding SESSION).
- Componentisation : `styles-v2.css` COPIÉ dans `src/styles/` et importé 1x dans BaseLayout. Les maquettes deviennent
  des composants (.astro) qui réutilisent les classes du DS → rendu fidèle. Ajouts au DS pendant l'adaptation (mirrorés
  aussi dans design/styles-v2.css) : règles `<img>` réelles (.card .thumb img, img.bg), utilitaire `.grid.cols-N`,
  `.ad-slot.filled`, `.ad-band`, `.article-hero-split` + `.ad-square`, `.article-summary`, `.stat-panel`, `.flow`,
  `.h-section`, `.related-grid`, `.listing-layout/.listing-grid/.listing-side`, `.ad-anchor` (fixed bas, `.is-visible`).
- D1 : schéma Drizzle (sqlite-core) tables categories, games, authors, articles (+ champs SEO : meta_description,
  og_image, canonical, noindex, draft ; + rating/verdict/pros/cons/tier/reading_time/cover/cover_alt/cover_source/
  published_at/updated_at/featured), tags, article_tags. `drizzle.config.ts` (dialect sqlite) →
  `npx drizzle-kit generate` (migrations/0000_*.sql) → `npx wrangler d1 migrations apply blogstarter-db --local`.
- Accès données ⚠ PIÈGE MAJEUR : `Astro.locals.runtime.env` a été SUPPRIMÉ (Astro v6). Erreur 500 au 1er run.
  Correctif : `import { env } from 'cloudflare:workers'` puis `const DB = env.DB`. Utilisé dans chaque page/endpoint.
- Requêtes : src/lib/queries.ts (D1 prepared statements : getCategory, listByCategory, latest, latestInCategory,
  trending, listGames, getArticle, relatedArticles). util.ts : badgeClass, fmtDate, withHeadingIds (génère les id de
  titres + le sommaire), parseJsonArray.
- Import : `node scripts/import-content.mjs` lit contents/**/*.md (gray-matter) + _images.json, **télécharge les covers**
  vers public/wp-content/uploads/2026/08/24/ (réécrit cover en URL locale), rend le Markdown→HTML (marked → body_html),
  génère `seed.sql`. Puis `npx wrangler d1 execute blogstarter-db --local --file=./seed.sql`. Résultat : 30 articles, 10 jeux, 50 tags.
- Routes SSR : `/` (index.astro), `/[category]` (listing), `/[category]/[slug]` (single), 404.astro. Cache edge sur pages :
  `Astro.response.headers.set('Cache-Control','public, s-maxage=300, stale-while-revalidate=600')`.
- Médias R2 : route `src/pages/media/[...key].ts` sert depuis `env.MEDIA` (Content-Type par extension, Cache-Control immutable).
  Créatives pub : media-src/ads/*.webp uploadées sur R2 ; référencées par AdLeaderboard (728×90) et AdRectangle (300×250).
- Dev : `npx astro dev --background` (stop/status/logs). Bindings locaux via platformProxy. ⚠ Redémarrer le dev après
  ajout d'un binding (ex. R2) pour qu'il soit chargé.

## PARTIE 07 — SEO/GEO (lire : src/layouts/BaseLayout.astro, src/pages/[category]/[slug].astro,
##   src/pages/{sitemap.xml,robots.txt,ads.txt,llms.txt,rss.xml}.ts)
- BaseLayout `<head>` : title unique, meta description, canonical, meta robots (noindex si draft), Open Graph +
  Twitter cards, og:site_name, theme-color, meta article (published/modified/author), + JSON-LD **site** (@graph :
  Organization + WebSite avec SearchAction).
- Article : JSON-LD **@graph** : Article ou **Review** (avec reviewRating + itemReviewed VideoGame) + **BreadcrumbList**.
- Endpoints générés (car contenu DYNAMIQUE en D1 → @astrojs/sitemap ne suffit pas) : `sitemap.xml` (home + catégories +
  30 articles, lastmod=updated_at), `robots.txt` (+ crawlers IA GPTBot/PerplexityBot/ClaudeBot + lien sitemap),
  `ads.txt` (placeholder AdSense à compléter), `llms.txt` (plan GEO listant les articles par catégorie), `rss.xml`.
- Perf/CWV : images avec width/height + loading=lazy, imageService passthrough (pas de traitement), cache edge,
  polices à self-hoster (prévu).

## PARTIE 08 — Monétisation & conformité (lire : src/components/AdLeaderboard.astro, AdRectangle.astro,
##   src/pages/{legal-notice,privacy,cookies}.astro)
- Emplacements réservés dès le DS (bon CLS) : leaderboard 728×90 (bande haute + ancre bas), rectangle 300×250 (hero + sidebar),
  in-feed natif (dans la grille listing/home). Ancre : masquée par défaut, apparaît au scroll passé la byline (desktop+mobile),
  fermable (✕), format 728×90.
- Créatives : **optimisées WebP (cwebp) + sans métadonnées**, stockées sur **R2** (bucket blogstarter-media, clés ads/…webp),
  servies via la route /media. ads.txt requis pour AdSense.
- Consentement : bandeau cookies (composant DS) — à brancher au Consent Mode (pas encore implémenté). Pages légales
  (Legal notice, Privacy, Cookies) créées en anglais (RGPD/ePrivacy, AdSense) via un agent background, avec un encadré
  « template à faire valider par un juriste » et des placeholders [ ]. Footer câblé vers /legal-notice, /privacy, /cookies.

## PARTIE 09 — Déploiement Cloudflare (COMMANDES RÉELLES, dans l'ordre)
1. `npx wrangler login` (interactif, côté utilisateur). Vérif `npx wrangler whoami` (compte votre-compte@gmail.com).
2. astro.config : `imageService:'passthrough'` (évite le binding Cloudflare Images).
3. `npx wrangler d1 create blogstarter-db` → renvoie `database_id` (réel : <VOTRE_DATABASE_ID>) →
   collé dans wrangler.jsonc (remplace le placeholder local).
4. `npx wrangler kv namespace create SESSION` (ici « already exists » → `npx wrangler kv namespace list` pour récupérer
   l'id <VOTRE_KV_NAMESPACE_ID>) → binding SESSION dans wrangler.jsonc (sessions Astro).
5. `npx wrangler r2 bucket create blogstarter-media` (⚠ prompt interactif « add on your behalf? » → non en contexte non-interactif ;
   vérifier avec `npx wrangler r2 bucket list`).
6. `npx wrangler d1 migrations apply blogstarter-db --remote`.
7. `npx wrangler d1 execute blogstarter-db --remote --file=./seed.sql` (30 articles). Vérif : `... --remote --command "SELECT COUNT(*) FROM articles;"`.
8. `npx wrangler r2 object put blogstarter-media/ads/arknights-endfield-728x90.webp --file=media-src/ads/…webp --remote` (×2).
9. `npm run build` (SSR Cloudflare).
10. `npx wrangler deploy` → URL **https://blogstarter.votre-compte.workers.dev**. Bindings connectés : SESSION (KV), DB (D1),
    MEDIA (R2), ASSETS. Assets (public/ dont wp-content) déployés automatiquement.
11. Vérifs prod (toutes 200) : `/`, `/reviews/where-winds-meet`, `/guides`, `/media/ads/…webp` (image/webp),
    `/wp-content/…jpg`, `/sitemap.xml`, `/robots.txt`, `/privacy` ; 404 sur slug inexistant.
12. À faire ensuite : brancher le domaine `votreblog.com` (dashboard → Custom domain, SSL auto), Search Console + sitemap,
    compléter ads.txt et les placeholders légaux.
- Coût : 0 € sur les quotas gratuits pour un blog qui démarre.

## PARTIE 10 — Versioning GitHub (COMMANDES RÉELLES)
- `gh auth status` (déjà connecté, compte « username », scope repo).
- `.gitignore` à la racine gaming/ : node_modules/, dist/, .astro/, .output/, .wrangler/, .env*, .dev.vars, .DS_Store, *.log.
- `git init -b main` (à la racine gaming/, projet non versionné au départ) ; `git config user.name/email` ; `git add -A` ;
  `git commit` (136 fichiers, 0 node_modules) ; `gh repo create blogstarter --private --source=. --remote=origin --push`.
- Résultat : **https://github.com/username/blogstarter** (PRIVÉ).
- CI optionnel : connecter le repo à Cloudflare pour un déploiement auto à chaque git push.

## PARTIE 11 — Annexes : pièges réels rencontrés (à documenter)
1. Design system V1 trop générique → refonte V2 avec parti pris fort (Command HUD).
2. `Astro.locals.runtime.env` supprimé (Astro v6) → `import { env } from 'cloudflare:workers'` (erreur 500 sinon).
3. Agents `.claude/agents` non reconnus en cours de session → fallback general-purpose avec le même prompt.
4. `sips` laisse un bloc « Photoshop 3.0 » (+ parfois XMP) → utiliser `cwebp` (strip total) pour les créatives ; chaîne cwebp→dwebp→sips pour un JPEG propre.
5. `wrangler r2 bucket create` peut poser un prompt interactif → vérifier l'existence ensuite.
6. `imageService:'passthrough'` pour éviter le binding IMAGES au deploy ; binding KV SESSION requis pour les sessions.
7. Redémarrer `astro dev` après tout ajout de binding.
8. Featured de la home : ne garder que le titre (choix éditorial validé).
