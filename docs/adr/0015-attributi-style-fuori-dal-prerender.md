# ADR-0015: Nessun attributo `style` nell'HTML prerenderizzato

- **Stato**: Accettata
- **Data**: 2026-10-31
- **Fase**: 2A
- **Chiude**: il tipo C di ADR-0012

## Contesto

La CSP del sito ammette per gli stili solo `style-src 'self'`, senza `'unsafe-inline'` (ADR-0012). Un attributo `style="…"` scritto nell'HTML prerenderizzato viene bloccato, e l'idratazione non lo riapplica. Dopo l'idratazione, invece, React applica la prop `style` tramite il CSSOM, che la CSP non governa.

Nella 1B gli attributi `style` erano prodotti da:

- `Glyph` (`--glyph-width`, `--glyph-height`);
- `ProgressBar` (`--progress-value`);
- React Aria: `VisuallyHidden` per gli input di Checkbox, Radio e `HiddenSelect`, `display:contents` per le celle di `GridList`, posizionamento di Popover e Tooltip, `--visual-viewport-*` di `ModalOverlay`.

Nella F2A questi componenti arrivano sulla home, insieme alla posizione e alla dimensione delle finestre.

## Decisione

1. **Glyph senza variabili inline.** `npm run icons` genera `glyphSizes.module.css`, con una classe per glifo, e `Glyph` usa quella classe. Un test di `Icon` verifica che non ci sia l'attributo `style`.
2. **Solo HTML e CSS nel prerender.** L'HTML prerenderizzato contiene il guscio statico del desktop (ADR-0014), che non usa React Aria. Tutti i componenti di React Aria, con i loro `style`, vengono resi solo sul client dopo l'idratazione, dove la prop `style` passa dal CSSOM.
3. **Geometria delle finestre** (`--window-z`, `--window-cascade`, in 2A-2 `--window-x/y/w/h`) come prop `style` di React, solo nel desktop interattivo. Nel guscio la finestra della route prende la posizione predefinita dal CSS, senza numeri.
4. **Verifiche**:
   - test prerender: nessun attributo `style` in tutte le 31 pagine HTML del sito;
   - unit: il guscio non produce `style` con il rendering lato server, per ogni route e lingua (`Desktop.test.tsx`);
   - inventario delle story (`prerenderStyles.test.ts`): gli attributi `style` noti di React Aria restano elencati, perché si verificano solo fuori dal prerender; Glyph non c'è più;
   - e2e con la CSP reale sulla home (`csp.spec.ts`): nessuna violazione dal caricamento allo swap e nell'uso del desktop (celle `display:contents`, popover del menu Start, geometria delle finestre), in Chromium, Firefox e WebKit;
   - controllo in negativo: già presente sulla 404 (sentinella tolta).

## Alternative considerate

| Alternativa                                                          | Pro                                 | Contro                                                                                                                                        | Perché scartata                                      |
| -------------------------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `style-src-attr 'unsafe-hashes'` con l'hash di ogni attributo        | Standard CSP3                       | Allarga la CSP; un hash per ogni combinazione di glifi e geometrie, da ricalcolare in build; supporto da verificare in Safari                 | Più fragile e meno sicuro                            |
| Classi e custom property via CSSOM dopo il montaggio, ovunque        | CSP invariata                       | Codice imperativo per ogni componente                                                                                                         | Non serve: dopo l'idratazione React usa già il CSSOM |
| Rendere dopo l'idratazione solo le parti nascoste (`VisuallyHidden`) | Componenti React Aria nel prerender | Il markup di React Aria nel prerender ha altri `style` (`display:contents`, popover) e i suoi controlli non funzionano prima dell'idratazione | Sostituita dal guscio statico (ADR-0014)             |

## Conseguenze

- Positive: CSP invariata e nessuna eccezione; una sola regola semplice ("nel prerender solo HTML e CSS"), verificata dai test.
- Negative: i componenti di React Aria non possono comparire nell'HTML prerenderizzato. Contenuti e controlli che devono esserci senza JavaScript vanno scritti in HTML nel guscio.
- Da rivedere: in F3B per il form Contatti (la sua versione senza JavaScript va nel guscio) e in F4A per il Pannello di controllo. Checkbox e Select si provano con la CSP reale quando entrano in una pagina (PLAN.md).

## Riferimenti

- `src/components/Icon/Glyph.tsx`, `src/components/Icon/glyphSizes.module.css`, `scripts/lib/icons.mjs`, `src/features/desktop/shell/`, `src/components/prerenderStyles.test.ts`, `tests/prerender/html.test.ts`, `tests/e2e/csp.spec.ts`
- ADR-0012, ADR-0014
