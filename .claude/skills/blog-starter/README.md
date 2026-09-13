# blog-starter — Claude Code skill (framework de blog)

Un **skill Claude Code** qui génère un blog rapide, monétisé et SEO/GEO-ready
(**Astro + Cloudflare** D1/R2/KV) à partir d'une simple config : **niche, catégories,
couleurs, auteurs, sujets**. Il déroule le process **étape par étape**, avec portes de
validation, en s'appuyant sur une documentation complète (implémentation de référence : BlogStarter).

Bundle **auto-suffisant** : ce dossier contient le skill *et* sa documentation.

## Contenu
```
blog-starter/
├── SKILL.md                     # l'orchestrateur (lu par Claude Code)
├── README.md                    # ce fichier
├── schema/blog.config.schema.json  # schéma de validation de la config (+ .example.json)
├── templates/
│   ├── design-system/base.css   # design system thémable (tokens --accent*, --on-accent…)
│   ├── design-system/theme-preview.html
│   ├── design-system/gabarits/  # maquettes de validation (home/listing/article/review/styleguide)
│   ├── themes/*.css             # presets : command-hud, cyber-magenta, arcade-cyan, neutral-pro, editorial-warm
│   ├── astro/                   # squelette Astro complet paramétrable (+ TEMPLATE.md)
│   └── agents/                  # 4 rédacteurs + photo-finder paramétrés par niche (+ TEMPLATE.md)
├── scripts/gen-theme.mjs        # génère un thème complet depuis 1 accent
└── references/                  # la documentation (12 parties HTML) = base de connaissance
```

## Installation (pour toute personne)
Copier ce dossier dans l'un de ces emplacements, puis relancer Claude Code :

```bash
# Option A — disponible partout (recommandé)
cp -R blog-starter ~/.claude/skills/

# Option B — pour un projet précis
mkdir -p <votre-projet>/.claude/skills
cp -R blog-starter <votre-projet>/.claude/skills/
```

## Utilisation
Dans Claude Code, invoquer :
```
/blog-starter
```
ou simplement demander : « **crée-moi un blog** » / « nouveau blog sur [niche] ».
Claude posera les questions (niche, catégories, couleurs, auteurs, sujets), puis
déroulera les phases en validant le design system et les gabarits avec vous.

## Choisir/générer un thème
- **Preset** : indiquer un des thèmes de `templates/themes/`.
- **Couleur custom** : générer un thème depuis un seul accent —
  ```bash
  node scripts/gen-theme.mjs "#7c5cff" dark mon-theme > templates/themes/mon-theme.css
  ```
- **Prévisualiser** : remplacer `__THEME__` dans `templates/design-system/theme-preview.html`
  par le thème choisi et ouvrir la page (les composants se re-colorisent tout seuls).

## Prérequis
Node + npm, `wrangler` (Cloudflare) et `gh` (GitHub) pour le déploiement/versioning ;
un compte Cloudflare + un domaine. Les logins et le déploiement restent des actions utilisateur.

## Statut
v1 — **design system thémable + presets + générateur + gabarits de validation + squelette
Astro complet + agents paramétrés + schéma de config + runbook de bout en bout** : prêts.
Les templates s'appuient sur des placeholders substitués depuis `blog.config.json`
(voir `SKILL.md` → « Substitution des placeholders »). La documentation `references/`
sert de base de connaissance détaillée par phase.

## Crédits
Process et implémentation de référence : projet BlogStarter. Réutilisable librement pour
créer votre propre blog de niche.
