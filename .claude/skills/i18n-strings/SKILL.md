---
name: i18n-strings
description: Aggiunge o modifica testi dell'interfaccia in italiano e inglese nei dizionari tipizzati, con chiavi allineate, tono di docs/CONTENT.md e grafia corretta del nome (N sul sito, M in GitHub ed email).
---

# Testi IT/EN

## Passi

1. Trova il dizionario: `src/i18n/it.ts` ed `en.ts` per testi globali (meta, persona, navigazione), oppure `src/features/<app>/i18n/` per i testi di un'app.
2. Aggiungi la chiave **prima in `it`** (definisce il tipo), poi in `en`. TypeScript segnala le chiavi mancanti.
3. Chiavi in inglese, camelCase, raggruppate per area. Per i plurali usa una funzione con `Intl.PluralRules`; per date e numeri `Intl`.
4. Includi anche alt, aria-label, titoli delle finestre, messaggi di errore e meta (title ≤ 60, description ≤ 160).
5. Testi personali: la fonte è `docs/CONTENT.md`. Un testo marcato `BOZZA – da rivedere` **non va online** senza l'approvazione di Gianpaolo.
6. Nome: "Gianpaolo Del Moro" (N) nei testi; "giampaolo" (M) solo negli URL GitHub e nell'email, presi da `src/config/site.ts`. Email mai in chiaro nel markup prerenderizzato.
7. Verifica a 320 px in entrambe le lingue che nulla si tagli.
8. Aggiorna i test che verificano i testi e chiedi una review all'agente `content-reviewer`.

## Checklist

- [ ] Stesse chiavi in `it` ed `en`, stesso significato, tono naturale
- [ ] Nessuna stringa visibile hardcoded nei componenti
- [ ] CONTENT.md aggiornato se cambia un contenuto personale
- [ ] `npm run typecheck` e test verdi

## Riferimenti

docs/I18N.md, docs/CONTENT.md, ADR-0008.
