import { cx } from "../cx";
import { type GlyphName, glyphs } from "./glyphData";
import sizes from "./glyphSizes.module.css";
import styles from "./Icon.module.css";

export type GlyphProps = {
  name: GlyphName;
  className?: string | undefined;
};

export function Glyph({ name, className }: GlyphProps) {
  const { width, height, path } = glyphs[name];

  return (
    <svg
      className={cx(styles.glyph, sizes[name], className)}
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <path d={path} />
    </svg>
  );
}
