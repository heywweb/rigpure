-- seed.example.sql — amorce minimale (structure). Le seed réel est GÉNÉRÉ par
-- scripts/import-content.mjs à partir des articles Markdown de contents/.
-- Les catégories et l'auteur ci-dessous sont des exemples : le skill les régénère
-- depuis blog.config.json (categories + authors).

DELETE FROM article_tags; DELETE FROM articles; DELETE FROM tags;
DELETE FROM games; DELETE FROM authors; DELETE FROM categories;

INSERT INTO categories (id,slug,name,description) VALUES (1,'games','Games','Profiles of the PC games we cover.');
INSERT INTO categories (id,slug,name,description) VALUES (2,'reviews','Reviews','Hands-on reviews with a verdict.');
INSERT INTO categories (id,slug,name,description) VALUES (3,'guides','Guides','In-depth guides.');
INSERT INTO categories (id,slug,name,description) VALUES (4,'news','News','Latest news.');

-- Auteur principal — depuis blog.config.json.authors[0]
INSERT INTO authors (id,slug,name,bio,avatar,role,twitter) VALUES (1,'alex','Alex','PC gaming reviewer — plays and tests every title covered before writing.',NULL,'Editor',NULL);

-- Les articles, jeux et tags sont insérés par l'import de contenu (phase 5).
