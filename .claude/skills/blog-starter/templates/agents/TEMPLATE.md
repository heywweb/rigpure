# templates/agents — rédacteurs paramétrés par la niche

Quatre **templates de rôle** dérivés de l'implémentation de référence, généralisés à
n'importe quelle niche. Le skill les installe dans `.claude/agents/` du projet après
substitution des placeholders depuis `blog.config.json`.

## Les rôles

| Fichier | Rôle | Sort |
|---|---|---|
| `guide-writer.md` | Guides / how-to / comparatifs | `contents/guides/<slug>.md` |
| `news-writer.md` | Actualité (annonce, mise à jour, événement) | `contents/news/<slug>.md` |
| `review-writer.md` | Tests / reviews (verdict, note, pros/cons) | `contents/reviews/<slug>.md` |
| `photo-finder.md` | Recherche d'images | `contents/_images.json` |

> Ce sont les **archétypes**. Adapter aux catégories réelles de la niche : garder ceux
> qui correspondent, dupliquer/renommer au besoin (une catégorie sans équivalent
> évident part le plus souvent du `guide-writer`).

## Placeholders

| Placeholder | Source | Exemple |
|---|---|---|
| `{{slug}}` | slug de `brand` | `blogstarter` → agents `blogstarter-guide-writer`… |
| `{{brand}}` | `brand` | `BlogStarter` |
| `{{niche}}` | `niche` | `guides de jeux live-service` |
| `{{language}}` | `language` | `en` |
| `{{author}}` | `authors[0].name` | `Alex` |
| `{{date}}` | date du jour (ISO `AAAA-MM-JJ`) | `2026-08-29` |
| `{{entity}}` | l'entité centrale de la niche | `jeu`, `produit`, `outil`, `destination`… |

## Le champ `game` (entité de niche)

Le frontmatter et le schéma D1 de référence utilisent un champ **`game`** — héritage du
module gaming. Il désigne en réalité **l'entité centrale de la niche** (`{{entity}}`) :
un jeu, un produit, un logiciel, un lieu… Pour la v1, **on conserve le nom `game`**
(compatibilité avec `import-content.mjs`, `schema.ts` et les requêtes) même sur une niche
non-gaming. Un module de niche pourra renommer ce champ plus tard.

## Pipeline (ordre important)

```
photo-finder  →  contents/_images.json   (BLOQUANT : à produire en premier)
                      │
     ┌────────────────┼────────────────┐
guide-writer     news-writer      review-writer   (en parallèle, lisent le même JSON)
```

Séquencer les images **avant** la rédaction garantit que chaque article a une `cover`
valide dès sa première écriture. Les rédacteurs reçoivent en prompt la liste des entités
(`seeds`) et le nombre d'articles par catégorie (`content.articlesPerCategory`).

## Garde-fous
- **Droits des images** : `photo-finder` produit des URLs de maquette — vérifier les droits
  avant toute publication réelle (champ `credit`).
- **Langue** : chaque rédacteur écrit dans `{{language}}` ; ne pas mélanger les langues.
- **Pas d'invention** : rester factuel, ne pas fabriquer de chiffres invérifiables.
