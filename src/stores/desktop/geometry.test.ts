import { describe, expect, it } from "vitest";
import { clampGeometry, edges, isGeometry, moveBy, resizeBy } from "./geometry";

const viewport = {
  width: 800,
  height: 600,
  minWidth: 240,
  minHeight: 120,
  keepVisible: 48,
  titlebarHeight: 28,
};
const window = { x: 100, y: 100, width: 300, height: 200 };

describe("geometria delle finestre", () => {
  it("lascia com'è una finestra che sta nell'area", () => {
    expect(clampGeometry(window, viewport)).toEqual(window);
  });

  it("tiene visibile almeno una parte della barra del titolo", () => {
    expect(clampGeometry({ ...window, x: -1000, y: -20 }, viewport)).toMatchObject({
      x: 48 - 300,
      y: 0,
    });
    expect(clampGeometry({ ...window, x: 5000, y: 5000 }, viewport)).toMatchObject({
      x: 800 - 48,
      y: 600 - 28,
    });
  });

  it("rispetta la misura minima e non supera l'area", () => {
    expect(clampGeometry({ ...window, width: 10, height: 10 }, viewport)).toMatchObject({
      width: 240,
      height: 120,
    });
    expect(clampGeometry({ ...window, width: 9000, height: 9000 }, viewport)).toMatchObject({
      width: 800,
      height: 600,
    });
  });

  it("sposta di un passo", () => {
    expect(moveBy(window, 8, -32)).toEqual({ ...window, x: 108, y: 68 });
  });

  it.each([
    ["e", 20, 0, { x: 100, y: 100, width: 320, height: 200 }],
    ["s", 0, 20, { x: 100, y: 100, width: 300, height: 220 }],
    ["w", 20, 0, { x: 120, y: 100, width: 280, height: 200 }],
    ["n", 0, 20, { x: 100, y: 120, width: 300, height: 180 }],
    ["se", -500, -500, { x: 100, y: 100, width: 240, height: 120 }],
    ["nw", 500, 500, { x: 160, y: 180, width: 240, height: 120 }],
  ] as const)("ridimensiona dal bordo %s", (edge, dx, dy, expected) => {
    expect(resizeBy(window, edge, dx, dy, viewport)).toEqual(expected);
  });

  it("elenca gli otto bordi e riconosce una geometria valida", () => {
    expect(edges).toHaveLength(8);
    expect(isGeometry(window)).toBe(true);
    expect(isGeometry({ ...window, x: Number.NaN })).toBe(false);
    expect(isGeometry(null)).toBe(false);
  });
});
