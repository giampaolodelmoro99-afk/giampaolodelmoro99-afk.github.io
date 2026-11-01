export type ResizeEdge = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";

export const resizeEdges: readonly ResizeEdge[] = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

export const isResizeEdge = (value: string | undefined): value is ResizeEdge =>
  resizeEdges.some((edge) => edge === value);
