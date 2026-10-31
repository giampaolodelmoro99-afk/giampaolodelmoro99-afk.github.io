import { Fragment } from "react";
import { Glyph } from "../../../components/Icon";
import styles from "../Desktop.module.css";

export function ShortcutText({ text, isApple }: { text: string; isApple: boolean }) {
  const parts = text.split("{alt}");
  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={`${index}-${part}`}>
          {index > 0 &&
            (isApple ? (
              <>
                <Glyph name="option" className={styles.inlineGlyph} />
                <span className={styles.visuallyHidden}>Option+</span>
              </>
            ) : (
              "Alt+"
            ))}
          {part}
        </Fragment>
      ))}
    </>
  );
}
