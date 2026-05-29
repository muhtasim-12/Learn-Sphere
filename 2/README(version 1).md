# KnowAtlas V3 - Universal Knowledge Catalog

This version implements the product requirements:

## 1. Standardized Catalog Data
All catalog data is stored in clean JSON format with fields:
- id
- title
- subtitle
- authors
- genres
- category
- type
- language
- access_type
- trust_level
- description
- tags
- sources
- related_topics
- rating
- views
- trending_score

Main files:
- `data.js` for the website
- `api/catalog.json` for public sharing / data dump

## 2. Optimized Search and Browsing
Added:
- Search across title, authors, genre, tags, category, source and related topics
- Category chips
- Type filter
- Access filter
- Sort by rating, trending, views or title
- Recommendation widgets:
  - Trending
  - Highly Rated
  - Public Domain / Free

## 3. Public Sharing
A static public data dump is available at:

`api/catalog.json`

In a real deployment, this can become:

`https://yourdomain.com/api/catalog.json`

## How to run
Open `index.html` in a browser.

## Next serious upgrade
Build a backend with:
- Node.js/Express or Django
- PostgreSQL
- Admin panel
- Real API endpoints
- External APIs: Google Books, Open Library, Wikipedia/Wikidata, Project Gutenberg, Crossref
