---
name: window-app
description: Aggiunge una nuova app/finestra al desktop Win95 con route IT/EN e deep link, contenuto prerenderizzato, metadati e JSON-LD, icona, voce nel menu Start, versione mobile, testi i18n e test. Da usare per About, Progetti, Contatti, giochi e ogni altra finestra.
---

# Nuova app del desktop

## Passi

1. **Route**: aggiungi la chiave in `src/routes/routeMap.ts` con lo slug IT e lo slug EN (`/en/...`), in kebab-case, con la slash finale. Controlla SPECS.md §6 se riguarda un URL della v1.
2. **Modulo route**: in `src/app/routes.ts` aggiungi le route per lingua; in `src/app/routes/<app>.tsx` metti solo `meta` (via `buildMeta`) e un componente che delega alla feature.
3. **Feature** in `src/features/<app>/`, caricata in **lazy** dal window manager. Il contenuto deve essere renderizzato senza effetti né dati asincroni, perché finisca nell'HTML prerenderizzato: HTML semantico (`h1`/`h2`, liste, `dl`, link).
4. **Testi**: dizionari `it`/`en` della feature (skill `i18n-strings`), inclusi titolo della finestra, meta title (≤ 60) e description (≤ 160), alt e aria-label.
5. **SEO**: `buildMeta(locale, key)`; JSON-LD aggiuntivo se serve (es. `SoftwareSourceCode`). Sitemap, hreflang e llms.txt derivano da `routeMap` (dalla F5).
6. **Desktop**: icona originale (Claude Design, registrata in ASSETS.md), voce nel menu Start, comportamento all'apertura e geometria iniziale.
7. **Mobile**: finestra a schermo intero, navigazione touch, target ≥ 44 px (ADR-0007).
8. **Test**:
   - unit e axe della feature
   - e2e: deep link IT ed EN (status 200, titolo, contenuto), apertura dal desktop e dal menu Start senza reload, cambio lingua sulla stessa finestra, viewport 320/1440 e touch, screenshot `@visual`
   - prerender: aggiungi la route a `tests/prerender/html.test.ts` se non è coperta automaticamente da `routeMap`
   - Lighthouse: aggiungi gli URL IT ed EN a `lighthouserc.*.json`
9. **Verifica** con `npm run build:site && npm run preview` e QA_CHECKLIST.md (anche mobile).

## Checklist di uscita

- [ ] Deep link IT ed EN funzionanti e prerenderizzati con contenuto completo
- [ ] Chunk lazy: `npm run size` entro budget
- [ ] Lighthouse nelle soglie di ADR-0018 sui nuovi URL (in CI)
- [ ] axe pulito, tastiera e touch verificati
- [ ] SPECS.md, ARCHITECTURE.md e PLAN.md aggiornati se serve

## Riferimenti

docs/ARCHITECTURE.md §3-6, docs/I18N.md, docs/PERFORMANCE_SEO.md, ADR-0005, 0006, 0007.
