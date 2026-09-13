# gabarits — maquettes HTML de validation

Maquettes **statiques** (HTML + `styles-v2.css`) qui matérialisent le design **avant**
de coder l'Astro. C'est la **porte de validation 🚦 de la phase 3** : on les ouvre dans un
navigateur, on fait valider le rendu, **puis** seulement on scaffolde le projet (phase 6).

| Fichier | Gabarit | Correspond à |
|---|---|---|
| `home.html` | Page d'accueil (spotlight, sections, sidebar) | `src/pages/index.astro` |
| `listing.html` | Archive catégorie / tag / auteur | `src/pages/[category]/index.astro` |
| `article.html` | Article standard (hero-split) | `src/pages/[category]/[slug].astro` |
| `article-review.html` | Variante review (verdict, note, pros/cons) | idem, mode review |
| `styleguide.html` | Vitrine de tous les tokens & composants | `src/styles/styles-v2.css` |

## À savoir
- Ces maquettes sont en **valeurs d'exemple** (`BlogStarter`, catégories `Guides/News/Reviews/Setup`,
  accent **#03A9F4**) pour un rendu immédiat — ce ne sont **pas** des templates à substituer.
  Les fichiers à placeholders `{{…}}` sont dans `templates/astro/`.
- `styles-v2.css` ici est une **copie** de `templates/astro/src/styles/styles-v2.css` (même source
  de vérité). Pour changer l'accent, régénérer via `scripts/gen-theme.mjs` et resynchroniser.
- Ordre non négociable : **styleguide validé → gabarits validés → Astro**. Une modif de rendu
  passe d'abord par le design system, jamais l'inverse.
