Icone originali in pixel art a 32 e 16 px, disegnate con la tavolozza a 16 colori `--color-pixel-*`.

## Cosa fornisce chi lo usa
- `name`: about, projects, cv, contacts, skills, timeline, makingof, controlpanel, terminal, minefield, trash, privacy, simpleview, run, gdm, warning, error, info.
- `size`: 16 o 32; `scale`: solo interi (2 per 64 px).
- `label` se l'icona porta informazione da sola; senza `label` è decorativa (`aria-hidden`).

## Regole
- L'icona inline (`Icon`) legge i colori dai token: il contorno `--color-pixel-outline` diventa bianco in alto contrasto.
- Gli SVG nel gruppo di asset Icone hanno i colori del tema classico scritti dentro: usali per favicon, immagini Open Graph o documentazione, non nell'interfaccia.
- Mai scalare a fattori non interi; mai sfocare o ruotare.
