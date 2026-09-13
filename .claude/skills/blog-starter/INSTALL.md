# BlogStarter — à lire en premier

Ce dossier contient **tout** : le skill Claude Code **et** sa documentation.

## 📖 Juste lire la documentation
Ouvrir dans un navigateur :

```
references/index.html
```

Les 12 parties décrivent le process complet (design system → contenu → Astro → déploiement).

## ⚙️ Utiliser le skill (générer un blog)

1. **Installer** — copier ce dossier dans les skills de Claude Code, puis relancer Claude Code :
   ```bash
   cp -R blog-starter ~/.claude/skills/            # dispo partout (recommandé)
   # ou, pour un projet précis :
   cp -R blog-starter <votre-projet>/.claude/skills/
   ```

2. **Lancer** — dans Claude Code :
   ```
   /blog-starter
   ```
   (ou simplement : « crée-moi un blog sur [votre niche] »)

3. Claude pose les questions (niche, catégories, couleurs, auteurs, sujets), puis
   déroule les phases **en validant avec vous** (design system, gabarits) jusqu'au déploiement.

## Prérequis
- **Node + npm** (obligatoire).
- Pour déployer : **wrangler** (Cloudflare) + **gh** (GitHub), un **compte Cloudflare** et un **domaine**.
- Les connexions (Cloudflare, GitHub) et le déploiement restent des **actions manuelles** de l'utilisateur.

## Repères
- `SKILL.md` — le runbook lu par Claude Code (phases 0→8, substitution des placeholders).
- `README.md` — détails du contenu et du fonctionnement.
- `schema/` — validation de la config. `templates/` — le site, les agents, le design.
  `scripts/` — générateur de thème. `references/` — la documentation.

> Testé de bout en bout : le skill génère un site qui **build et tourne** sur n'importe quelle niche.
> Pages légales (mentions, confidentialité) à compléter avant publication réelle.
