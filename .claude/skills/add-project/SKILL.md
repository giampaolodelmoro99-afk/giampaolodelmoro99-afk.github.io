---
name: add-project
description: Aggiunge un progetto GitHub al portfolio con dati tipizzati, testi IT/EN, immagini, case study opzionale e metadati scaricati a build time. Da usare dalla Fase 3A.
---

# Aggiungere un progetto GitHub

## Passi

1. **Verifica il repo**: l'URL usa "giampaolo" con M (`github.com/giampaolodelmoro99-afk/<repo>`), il repo è pubblico e ha un README.
2. **Dati**: aggiungi la voce in `src/content/projects.ts` seguendo il template di `docs/CONTENT.md` §6 (slug, nome e descrizione IT/EN, stack, contesto, ruolo, demo, immagini, `featured`, `caseStudy`). Non scrivere a mano stelle, linguaggi o date.
3. **Testi**: descrizioni brevi e concrete, approvate da Gianpaolo (se scritte da Claude, marcale come bozza in CONTENT.md).
4. **Immagini**: AVIF o WebP, con `width` e `height`, alt IT/EN, peso contenuto; registrale in `docs/ASSETS.md`. Niente loghi di terzi senza permesso.
5. **Metadati**: esegui lo script di build (`scripts/fetch-github.mjs`, ADR-0004) e committa il JSON generato.
6. **Case study** (opzionale): problema, scelte tecniche, difficoltà, risultato, in IT ed EN (CONTENT.md §7).
7. **SEO**: verifica il JSON-LD `SoftwareSourceCode` nella pagina del progetto e nell'elenco.
8. **Test**: unit sui dati (slug unici, testi IT/EN presenti), prerender (nome e descrizione nell'HTML), e2e (apertura della scheda e link al repo), screenshot se cambia l'elenco.

## Checklist

- [ ] Repo con "giampaolo" (M), dati senza metadati a mano
- [ ] Testi IT/EN approvati, immagini registrate
- [ ] `npm run build && npm run test:prerender` verdi, Lighthouse 100

## Riferimenti

docs/CONTENT.md §6-7, ADR-0004, docs/PERFORMANCE_SEO.md §5.
