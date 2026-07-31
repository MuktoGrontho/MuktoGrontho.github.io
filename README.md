# MuktoGrontho.github.io — মুক্তগ্রন্থ

Official website of **মুক্তগ্রন্থ** (MuktoGrontho) — উচ্চমানের বাংলা ই-বই, সকলের জন্য মুক্ত।

## 🌐 Live

[muktogrontho.github.io](https://muktogrontho.github.io)

## 🛠️ Tech Stack

- **[Astro](https://astro.build)** — Static site generator with content collections
- **Vanilla CSS** — Design tokens, no frameworks
- **Noto Serif Bengali + Noto Sans Bengali + Inter** — via Google Fonts

## 📂 Structure

```
src/
├── content/
│   └── books/           ← Add a book = add a .md file
│       ├── gitanjali.md
│       ├── devdas.md
│       └── ...
├── components/
│   └── BookCard.astro
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   ├── index.astro      ← Homepage
│   ├── books/
│   │   ├── index.astro  ← Searchable catalog
│   │   └── [slug].astro ← Auto-generated book pages
│   ├── about.astro
│   ├── contribute.astro
│   └── roadmap.astro
└── styles/
    └── global.css
```

## 📖 Adding a New Book

Create `src/content/books/your-book.md`:

```markdown
---
title: "পথের পাঁচালী"
titleEn: "Pather Panchali"
author: "বিভূতিভূষণ বন্দ্যোপাধ্যায়"
authorEn: "Bibhutibhushan Bandyopadhyay"
authorDeathYear: 1950
genre: "উপন্যাস"
genreEn: "Novel"
yearPublished: 1929
status: "planned"
coverColor: "#8c6b5d"
---

Book description in Bengali.
```

Push to `main` — the site auto-deploys via GitHub Actions.

## 🧑‍💻 Development

```bash
npm install
npm run dev    # http://localhost:4321
npm run build  # Static output → dist/
```

## License

Content: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) · Code: [MIT](LICENSE)
