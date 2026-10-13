import styles from "./TokenGallery.module.css";
import { bevelTokens, colorTokens } from "./tokens";

const themes = [
  { id: "classic", name: "Classico" },
  { id: "high-contrast", name: "Alto contrasto" },
] as const;

function ThemeColumns({ render }: { render: (theme: (typeof themes)[number]) => React.ReactNode }) {
  return (
    <div className={styles.themes}>
      {themes.map((theme) => (
        <section
          key={theme.id}
          className={styles.theme}
          data-theme={theme.id}
          aria-label={theme.name}
        >
          <h2 className={styles.title}>{theme.name}</h2>
          {render(theme)}
        </section>
      ))}
    </div>
  );
}

export function ColorTokens() {
  return (
    <ThemeColumns
      render={() => (
        <ul className={styles.list}>
          {colorTokens.map((name) => (
            <li key={name} className={styles.item}>
              <span className={styles.swatch} style={{ "--swatch": `var(${name})` }} />
              <code>{name}</code>
            </li>
          ))}
        </ul>
      )}
    />
  );
}

export function BevelTokens() {
  return (
    <ThemeColumns
      render={() => (
        <ul className={styles.list}>
          {bevelTokens.map((name) => (
            <li key={name} className={styles.item}>
              <span className={styles.bevel} style={{ "--swatch": `var(${name})` }} />
              <code>{name}</code>
            </li>
          ))}
        </ul>
      )}
    />
  );
}

export function Typography() {
  return (
    <ThemeColumns
      render={() => (
        <>
          <p className={`${styles.sample} ${styles.ui}`}>
            Pannello di controllo — à è é ì ò ù « » “ ” ‘ ’ … – — €
          </p>
          <p className={`${styles.sample} ${styles.ui}`}>
            <strong>Curriculum — Gianpaolo Del Moro</strong>
          </p>
          <p className={`${styles.sample} ${styles.document}`}>
            Sviluppatore full stack in formazione a Pisa. <em>Documento</em> in IBM Plex Sans, con{" "}
            <strong>grassetto</strong> e righe lunghe al massimo 68 caratteri.
          </p>
        </>
      )}
    />
  );
}
