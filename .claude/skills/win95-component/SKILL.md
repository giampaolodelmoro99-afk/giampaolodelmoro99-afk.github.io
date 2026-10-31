---
name: win95-component
description: Crea o modifica un componente del design system Win95 su React Aria Components con CSS Modules e token, responsive, con test, story e controllo axe. Da usare per ogni pulsante, campo, menu, finestra o controllo riutilizzabile.
---

# Componente del design system Win95

## Quando usarla

Per ogni componente riutilizzabile in `src/components/` (pulsante, campo, checkbox, menu, finestra, barra di stato…). Per un'app intera del desktop usa `window-app`.

## Passi

1. **Scegli la base React Aria**: il componente RAC corrispondente (`Button`, `TextField`, `Checkbox`, `Menu`, `ListBox`, `Dialog`…) o una composizione. Mai `div` o `span` cliccabili.
2. **File** in `src/components/<Nome>/`:
   - `<Nome>.tsx`: export nominale, props tipizzate, nessun commento, nessuna stringa visibile hardcoded (testi via props o `useUiStrings()`, che legge la lingua dall'`I18nProvider` di React Aria: I18N.md).
   - `<Nome>.module.css`: solo `var(--token)`. Stati con i selettori `[data-hovered]`, `[data-pressed]`, `[data-focus-visible]`, `[data-selected]`, `[data-disabled]`, `[data-open]`. Se manca un token, aggiungilo prima in `src/styles/tokens.css` e in `docs/DESIGN_SYSTEM.md`.
   - `<Nome>.test.tsx` e `<Nome>.stories.tsx`.
3. **Responsive mobile-first**: stile base valido a 320 px; target ≥ `var(--touch-target-min)` in modalità touch; nessuna funzione solo hover. Il `Tooltip` compare solo con hover e focus: **nessun contenuto può stare solo nel tooltip**, lo stesso testo va anche nell'etichetta, nel nome accessibile o in chiaro (`src/components/Tooltip/README.md`).
4. **Movimento**: solo `transform` e `opacity`, durate dai token (azzerate da reduced motion).
5. **Temi**: verifica classico e alto contrasto (`[data-theme="high-contrast"]`) e `forced-colors`.
6. **Test** (vedi skill `write-tests`):
   - render con `getByRole` e nome accessibile
   - interazione con `userEvent` (mouse e tastiera)
   - stati e varianti
   - `expectNoAxeViolations(container)` da `tests/setup/axe.ts`
7. **Story**: parti dal README e dal CSS di riferimento in `docs/design/gdm95/components/<Nome>/`. Story `Default` e `AllStates` con tutte le varianti e gli stati statici; tag `visual` **solo sugli stati principali** (stati, default, aperto, focus quando è una deroga). I test `tests/storybook/` fotografano le story `visual` in due combinazioni (classico con il mouse, alto contrasto con il touch) e passano ad axe tutte le story nelle quattro combinazioni (ADR-0019). Screenshot solo nel container.
8. **Verifica nel browser** (Storybook con `npm run storybook`; `npm run build` completo prima degli screenshot e dei test delle story, perché le story sono cambiate; `npm run build:site && npm run preview` se il componente è usato in una pagina) a 320 e 1440 px, con tastiera. Usa QA_CHECKLIST.md.

## Checklist di uscita

- [ ] `npm run lint`, `npm run typecheck`, `npm run test:coverage` verdi; e2e locali con `npm run test:e2e:chromium` (la matrice completa in CI)
- [ ] size-limit verde in CI (la tabella dei pesi in PERFORMANCE_SEO.md si aggiorna a fine fase)
- [ ] Nessun valore hardcoded (Stylelint verde), nessun commento nel `.tsx`
- [ ] axe pulito, focus visibile, target touch rispettati
- [ ] Story presente e verificata
- [ ] DESIGN_SYSTEM.md §6 aggiornato
- [ ] Eventuali icone o asset registrati in ASSETS.md

## Riferimenti

CLAUDE.md, docs/DESIGN_SYSTEM.md, docs/ACCESSIBILITY.md, docs/TESTING.md §5, ADR-0001.
