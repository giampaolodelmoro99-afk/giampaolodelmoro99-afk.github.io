import type { SVGProps } from "react";
import { cx } from "../cx";
import { type IconName, type IconSize, iconSizes } from "./iconData";
import spriteHref from "./iconSprite.svg?url";
import styles from "./Icon.module.css";

export type IconScale = 1 | 2 | 3;

export type SmallIconName = {
  [Name in IconName]: 16 extends IconSize<Name> ? Name : never;
}[IconName];

export type IconProps<Name extends IconName> = {
  name: Name;
  size?: IconSize<Name>;
  scale?: IconScale;
  label?: string;
  className?: string | undefined;
};

export function Icon<Name extends IconName>({
  name,
  size,
  scale = 1,
  label,
  className,
}: IconProps<Name>) {
  const sizes: readonly number[] = iconSizes[name];
  const drawn = size ?? Math.max(...sizes);
  if (!sizes.includes(drawn)) return null;
  const pixels = drawn * scale;
  const accessibility: SVGProps<SVGSVGElement> = label
    ? { role: "img", "aria-label": label }
    : { "aria-hidden": true, focusable: false };

  return (
    <svg
      className={cx(styles.root, className)}
      viewBox={`0 0 ${drawn} ${drawn}`}
      width={pixels}
      height={pixels}
      shapeRendering="crispEdges"
      {...accessibility}
    >
      <use href={`${spriteHref}#${name}-${drawn}`} />
    </svg>
  );
}
