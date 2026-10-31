export type Geometry = { x: number; y: number; width: number; height: number };

export type Viewport = {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  keepVisible: number;
  titlebarHeight: number;
};

export const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export const isGeometry = (value: unknown): value is Geometry =>
  typeof value === "object" &&
  value !== null &&
  ["x", "y", "width", "height"].every((key) => isNumber(Reflect.get(value, key)));

const between = (min: number, value: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

export function clampGeometry(geometry: Geometry, viewport: Viewport): Geometry {
  const width = between(viewport.minWidth, geometry.width, viewport.width);
  const height = between(viewport.minHeight, geometry.height, viewport.height);
  return {
    width,
    height,
    x: between(viewport.keepVisible - width, geometry.x, viewport.width - viewport.keepVisible),
    y: between(0, geometry.y, viewport.height - viewport.titlebarHeight),
  };
}

export function moveBy(geometry: Geometry, dx: number, dy: number): Geometry {
  return { ...geometry, x: geometry.x + dx, y: geometry.y + dy };
}

export type Edge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export const edges: readonly Edge[] = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

export function resizeBy(
  geometry: Geometry,
  edge: Edge,
  dx: number,
  dy: number,
  viewport: Pick<Viewport, "minWidth" | "minHeight">,
): Geometry {
  let { x, y, width, height } = geometry;
  if (edge.includes("e")) width = Math.max(viewport.minWidth, width + dx);
  if (edge.includes("s")) height = Math.max(viewport.minHeight, height + dy);
  if (edge.includes("w")) {
    const next = Math.max(viewport.minWidth, width - dx);
    x += width - next;
    width = next;
  }
  if (edge.includes("n")) {
    const next = Math.max(viewport.minHeight, height - dy);
    y += height - next;
    height = next;
  }
  return { x, y, width, height };
}
