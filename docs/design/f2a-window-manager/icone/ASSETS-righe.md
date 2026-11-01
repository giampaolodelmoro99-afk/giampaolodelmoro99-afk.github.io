# Righe per ASSETS.md · icone nuove F2A

Fonte: Claude Design, tela «GDM 95 · Window manager», 18/10/2026 (tavola «Icone nuove · Finestre e Spegni»).
Autore: Claude (Claude Design) per Gianpaolo Del Moro.
Licenza: contenuto del progetto, tutti i diritti riservati.
Disegni originali, non derivati da icone Microsoft: il simbolo di accensione è quello generico (cerchio aperto e barra), non il computer con la luna.

Formato identico alle icone del gruppo Icone di GDM 95: SVG pixel art su griglia 16 o 32, `shape-rendering="crispEdges"`, un `<path fill>` per colore, colori del tema classico scritti nel file (contorno `#000000`), tavolozza a 16 colori, luce in alto a sinistra. Nell'interfaccia vanno usate tramite il componente `Icon` (nomi `windows` e `power`), che legge `--color-pixel-*` e rende il contorno bianco in alto contrasto; gli SVG servono per documentazione, favicon e immagini.

| File | Etichetta IT / EN | Misura | Soggetto | Fonte | Autore | Licenza | SHA-256 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `windows-16.svg` | Finestre / Windows | 16×16 | due finestre sovrapposte, barra blu davanti e grigia dietro | Claude Design, tela «GDM 95 · Window manager», 18/10/2026 | Claude (Claude Design) per Gianpaolo Del Moro | contenuto del progetto, tutti i diritti riservati | `abd32f389ae51c1a9e611441bfefcaf1004b80661ee888829bbe86106ff3aeb4` |
| `windows-32.svg` | Finestre / Windows | 32×32 | due finestre sovrapposte, barra blu davanti e grigia dietro | Claude Design, tela «GDM 95 · Window manager», 18/10/2026 | Claude (Claude Design) per Gianpaolo Del Moro | contenuto del progetto, tutti i diritti riservati | `5710073c53789589a1cd29a28785fd2421e0b9ecc59ae5a0ee99de86dfa31b7c` |
| `power-16.svg` | Spegni / Shut down | 16×16 | pulsante tondo grigio con il simbolo di accensione generico, cerchio aperto e barra rossi | Claude Design, tela «GDM 95 · Window manager», 18/10/2026 | Claude (Claude Design) per Gianpaolo Del Moro | contenuto del progetto, tutti i diritti riservati | `ffa9bd2015da5e8c33df2a5b618f80fd76cde3dc90b275c909e05c3de980ae0c` |
| `power-32.svg` | Spegni / Shut down | 32×32 | pulsante tondo grigio con il simbolo di accensione generico, cerchio aperto e barra rossi | Claude Design, tela «GDM 95 · Window manager», 18/10/2026 | Claude (Claude Design) per Gianpaolo Del Moro | contenuto del progetto, tutti i diritti riservati | `5ed5ee43baf2f83cd7d7e1ce8c7acf0bdbb4bcbb3b08aaa095c8de46701327e0` |

Verifica: `sha256sum icone/*.svg` deve restituire gli stessi valori. Se un editor riformatta gli SVG (spazi, a capo), l'hash cambia: va ricalcolato sul file che entra nel repo.
