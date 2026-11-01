import { Fragment } from "react";
import { Glyph } from "../../../components/Icon";
import { useT } from "../../../i18n";
import styles from "../Desktop.module.css";

export function ShortcutText({ text, isApple }: { text: string; isApple: boolean }) {
  const t = useT();
  const parts = text.split("{alt}");
  const segments = parts.map((part, index) => ({
    part,
    isFirst: index === 0,
    offset: parts.slice(0, index).join("{alt}").length,
  }));
  return (
    <>
      {segments.map(({ part, isFirst, offset }) => (
        <Fragment key={offset}>
          {!isFirst &&
            (isApple ? (
              <>
                <Glyph name="option" className={styles.inlineGlyph} />
                <span className={styles.visuallyHidden}>{t.desktop.optionKey}</span>
              </>
            ) : (
              t.desktop.altKey
            ))}
          {part}
        </Fragment>
      ))}
    </>
  );
}
