import { type GlyphName, glyphs } from "./glyphData";
import styles from "./Icon.module.css";

export type GlyphProps = {
  name: GlyphName;
  className?: string;
};

export function Glyph({ name, className }: GlyphProps) {
  const { width, height, path } = glyphs[name];

  return (
    <svg
      className={[styles.glyph, className].filter(Boolean).join(" ")}
      style={{ "--glyph-width": width, "--glyph-height": height }}
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <path d={path} />
    </svg>
  );
}
