import type { SVGProps } from "react";
import { cx } from "../cx";
import { type IconData, type IconName, type IconSize, iconSizes, icons } from "./iconData";
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
  className?: string;
};

export function Icon<Name extends IconName>({
  name,
  size,
  scale = 1,
  label,
  className,
}: IconProps<Name>) {
  const variants: Partial<Record<number, IconData>> = icons[name];
  const data = variants[size ?? Math.max(...iconSizes[name])];
  if (!data) return null;
  const pixels = data.size * scale;
  const accessibility: SVGProps<SVGSVGElement> = label
    ? { role: "img", "aria-label": label }
    : { "aria-hidden": true, focusable: false };

  return (
    <svg
      className={cx(styles.root, className)}
      viewBox={`0 0 ${data.size} ${data.size}`}
      width={pixels}
      height={pixels}
      shapeRendering="crispEdges"
      {...accessibility}
    >
      {data.paths.map(([role, path]) => (
        <path key={`${role}-${path.slice(0, 16)}`} className={styles[role]} d={path} />
      ))}
    </svg>
  );
}
