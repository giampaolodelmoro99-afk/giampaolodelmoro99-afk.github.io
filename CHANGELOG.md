# Changelog

Formato: [Keep a Changelog](https://keepachangelog.com/it/1.1.0/). Le voci sono in italiano.

Ogni fase si chiude con un tag `phase-NN` (che non fa partire il deploy). Le release pubblicate usano tag `vX.Y.Z` secondo [SemVer](https://semver.org/lang/it/) e fanno partire il deploy: la prima sarà `v1.0.0`.

## [Unreleased]

## [phase-01a] - Fase 1A: fondamenta del design system GDM 95

### Aggiunto

- Pacchetto di consegna del design system GDM 95 in `docs/design/gdm95/` (riferimento approvato).
- Token GDM 95: temi classico e alto contrasto, attributi `data-theme`, `data-font`, `data-input`, `data-motion`, alias desktop e touch, focus a doppio anello, `forced-colors`; token in più per i valori letterali del CSS di riferimento.
- Font Pixel Operator (subset, CC0) e IBM Plex Sans (subset Latin1 ufficiali, OFL) con fallback metrici; Pixel Operator per titoli, etichette e controlli, IBM Plex Sans per frasi e paragrafi (`--font-family-prose`); preload di Pixel Operator bold e Plex regular.
- 33 icone originali GDM 95, componenti `Icon` e `Glyph` con colori dai token; favicon col monogramma GDM.
- Storybook 10 in `/storybook/` con CSP dedicata, noindex e `Disallow` in `robots.txt`; pagine Token e story di Icon e Glyph.
- Test: token e Stylelint, registro degli asset con SHA-256, glifi dei font, dati delle icone, workflow; story fotografate e controllate con axe nei due temi, con mouse e touch; idratazione dopo `load` con CPU 4×; focus in alto contrasto e forced-colors.
- `npm run analyze` (treemap del bundle), `npm run fonts`, `npm run icons`, `npm run preview -- --host`.
- ADR-0011 sulle vulnerabilità accettate nelle dipendenze di sviluppo.

### Modificato

- Focus da tastiera: doppio anello al posto del contorno di 1 px; testo del desktop su `--color-desktop-text`.
- Barra del titolo inattiva `#666666` (3,16:1 sul telaio) al posto di `#6a6a6a` del pacchetto.
- Agenti di review di sola lettura: niente strumenti di scrittura, hook che blocca i comandi Bash non di lettura, regole `deny` più larghe per git.
- Deploy solo con tag `vMAJOR.MINOR.PATCH`, con job di guardia; runner fissati a `ubuntu-24.04`.
- La preview ascolta solo in loopback (127.0.0.1 e ::1) salvo `--host`, e risponde 400 agli URL malformati.
- Documenti: LinkedIn non compare sul sito; app "Terminale" e "Campo minato" al posto dei nomi Microsoft.

## [phase-00] - Fase 0: Foundation

### Aggiunto

- Progetto React 19 + React Router 8 (framework mode, `ssr: false` + prerender) + Vite 8 + TypeScript 6 strict.
- Route `/` e `/en/` prerenderizzate con metadati completi (title, description, canonical, hreflang, Open Graph, Twitter card) e JSON-LD con `Person`, `WebSite` e `ProfilePage`.
- Pagina 404 prerenderizzata, servita da `404.html` con status 404.
- Token CSS iniziali e desktop vuoto responsive da 320 px.
- Post-build: CSP via meta tag con hash degli script inline, idratazione rinviata a dopo il `load`, controllo delle route prerenderizzate.
- Test: Vitest + Testing Library + vitest-axe (coverage minima 80%), test sull'HTML prerenderizzato, Playwright su 5 viewport + touch + Firefox con axe e regressione visiva, size-limit, Lighthouse CI mobile e desktop con soglia 100.
- Qualità: Oxlint (type-aware), Stylelint, Prettier, Husky (pre-commit, commit-msg, pre-push), commitlint.
- CI su `main` e `phase/*`, deploy manuale o su tag, Dependabot.
- Documentazione in `docs/`, ADR 0000–0010, configurazione di Claude Code (skill, agenti, hook).

### Rimosso

- Il codice della v1 (MUI, JavaScript), consultabile solo dal tag `v1.0.0-legacy`.

[Unreleased]: https://github.com/giampaolodelmoro99-afk/giampaolodelmoro99-afk.github.io/compare/phase-01a...HEAD
[phase-01a]: https://github.com/giampaolodelmoro99-afk/giampaolodelmoro99-afk.github.io/compare/phase-00...phase-01a
[phase-00]: https://github.com/giampaolodelmoro99-afk/giampaolodelmoro99-afk.github.io/compare/v1.0.0-legacy...phase-00
