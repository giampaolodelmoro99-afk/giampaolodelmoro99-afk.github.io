# gianpaolodelmoro.it — v2

[English](#english) · [Italiano](#italiano)

---

## English

Personal portfolio of **Gianpaolo Del Moro**, Full Stack Developer in training, with a Windows 95–inspired interface. Version 2 is being rewritten from scratch in documented phases. Version 1 lives only in the `v1.0.0-legacy` tag and stays online until the v2 release.

> Status: **Phase 0 – Foundation** (tooling, docs, CI). No features yet. See [docs/PLAN.md](docs/PLAN.md).

### Highlights

- **Static prerender + SPA.** React Router 8 in framework mode with `ssr: false` + `prerender`. Every route ships full semantic HTML, readable without JavaScript. After the first load, navigation is client-side only.
- **Lighthouse 100** in all four categories, on both the mobile and desktop presets, enforced in CI. Hydration starts after `load`, so the prerendered content paints without waiting for the bundle.
- **Strict CSP without `unsafe-inline`.** The policy is a meta tag with a SHA-256 hash for every inline script, computed at build time, because GitHub Pages allows no custom headers.
- **No third-party requests on page load**: no CDN, no analytics, no cookies. The e2e tests check this.
- **Accessibility first**: WCAG 2.2 AA, axe in unit and e2e tests, 44 px touch targets, reduced motion.
- **i18n** in Italian (default) and English, with translated slugs, hreflang and typed dictionaries.

### Stack

React 19 · React Router 8 · Vite 8 · TypeScript 6 (strict) · CSS Modules + design tokens · React Aria Components (from Phase 1) · Zustand (from Phase 2) · Vitest · Testing Library · Playwright · Lighthouse CI · Oxlint · Stylelint · Prettier

### Getting started

```bash
nvm use        # Node from .nvmrc
npm ci
npm run dev    # dev server (does NOT reflect CSP, prerender or deep links)
npm run build && npm run preview   # production-like, served like GitHub Pages
```

### Scripts

| Script                          | What it does                                                                |
| ------------------------------- | --------------------------------------------------------------------------- |
| `dev`                           | Vite dev server                                                             |
| `build`                         | Prerender + post-build (CSP hashes, 404, deferred hydration)                |
| `preview`                       | Serves `build/client` like GitHub Pages (301 on trailing slash, 404 status) |
| `lint` / `typecheck` / `format` | Oxlint + Stylelint / React Router typegen + tsc / Prettier                  |
| `test` / `test:coverage`        | Vitest unit tests (coverage ≥ 80%)                                          |
| `test:prerender`                | Checks the prerendered HTML (needs `build`)                                 |
| `test:e2e`                      | Full Playwright suite in the Playwright Docker image (same as CI)           |
| `test:e2e:host`                 | Playwright on the host, without visual tests                                |
| `size`                          | Bundle budgets (size-limit)                                                 |
| `lhci:mobile` / `lhci:desktop`  | Lighthouse CI with a score of 100 required                                  |

### Docs

Project documentation is in Italian and lives in [docs/](docs/): specs, architecture, design system, testing, accessibility, performance and SEO, legal, assets and ADRs.

### License

Code: MIT. Personal content (texts, CV, images): all rights reserved. See [LICENSE](LICENSE). "Windows" is a trademark of Microsoft Corporation; this project is not affiliated with Microsoft.

---

## Italiano

Portfolio personale di **Gianpaolo Del Moro**, Full Stack Developer in formazione, con un'interfaccia ispirata a Windows 95. La versione 2 viene riscritta da zero in fasi documentate. La versione 1 è consultabile solo dal tag `v1.0.0-legacy` e resta online fino alla release della v2.

> Stato: **Fase 0 – Foundation** (tooling, documentazione, CI). Nessuna funzionalità ancora. Vedi [docs/PLAN.md](docs/PLAN.md).

### Punti salienti

- **Prerender statico + SPA.** React Router 8 in framework mode con `ssr: false` + `prerender`. Ogni route ha HTML semantico completo, leggibile senza JavaScript. Dopo il primo caricamento la navigazione è solo lato client.
- **Lighthouse 100** in tutte e quattro le categorie, con preset mobile e desktop, verificato in CI. L'idratazione parte dopo il `load`, così il contenuto prerenderizzato si vede senza attendere il bundle.
- **CSP rigorosa senza `unsafe-inline`.** La policy sta in un meta tag con l'hash SHA-256 di ogni script inline, calcolato in build, perché GitHub Pages non permette header custom.
- **Nessuna richiesta a terze parti al caricamento**: niente CDN, analytics o cookie. Lo verificano i test e2e.
- **Accessibilità al centro**: WCAG 2.2 AA, axe nei test unitari ed e2e, target touch di 44 px, animazioni ridotte.
- **i18n** italiano (default) e inglese, con slug tradotti, hreflang e dizionari tipizzati.

### Stack

React 19 · React Router 8 · Vite 8 · TypeScript 6 (strict) · CSS Modules + token del design system · React Aria Components (dalla Fase 1) · Zustand (dalla Fase 2) · Vitest · Testing Library · Playwright · Lighthouse CI · Oxlint · Stylelint · Prettier

### Avvio

```bash
nvm use        # Node da .nvmrc
npm ci
npm run dev    # dev server (NON riflette CSP, prerender e deep link)
npm run build && npm run preview   # come in produzione, servito come da GitHub Pages
```

Gli script sono descritti nella tabella della sezione inglese. Il flusso di lavoro è in [CONTRIBUTING.md](CONTRIBUTING.md).

### Documentazione

Tutta in italiano, in [docs/](docs/): specifiche, architettura, design system, test, accessibilità, performance e SEO, aspetti legali, registro degli asset e ADR.

### Licenza

Codice: MIT. Contenuti personali (testi, CV, immagini): tutti i diritti riservati. Vedi [LICENSE](LICENSE). "Windows" è un marchio di Microsoft Corporation; questo progetto non è affiliato a Microsoft.
