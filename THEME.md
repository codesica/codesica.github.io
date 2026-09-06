# Theme provenance

Theme: Retypeset by radishzz.
Upstream: https://github.com/radishzzz/astro-theme-retypeset
Imported commit: a636b6d393be714cab52d3fc4baddd3f3905f701
Upstream commit date: 2026-04-12.
Imported on: 2026-09-06.
License: MIT, retained in LICENSE.

This is an independent repository, not a GitHub fork. Licensed theme source was imported without upstream Git history. The theme author's example articles, biography, comments endpoint, analytics and search-verification identifiers were removed.

Local customization:

- src/config.ts: Kai's metadata, root URL, Chinese-only configuration, monochrome colors, reduced motion, disabled comments and analytics.
- src/content/: original site notice and short biography; no imported personal articles.
- src/layouts/Head.astro: local article OG images; removed external screenshot API fallback and all analytics injection; canonical 404 fix and noindex; storage-safe theme initialization.
- src/layouts/Layout.astro: removed click sound effect; retained theme layout and useful reading widgets.
- src/pages/404.astro: Chinese error page and return link.
- public/icons/favicon.svg: Kai monogram.
- README.md, templates/post.md, deployment workflows and package metadata.

Before a theme upgrade, use a separate branch and review the diff; preserve site configuration and original articles. Do not blindly overwrite this repository with upstream files.
