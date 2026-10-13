import { describe, expect, it } from "vitest";
import { cx } from "./cx";

describe("cx", () => {
  it("unisce le classi presenti e scarta quelle assenti", () => {
    expect(cx("root", undefined, false, null, "", "active")).toBe("root active");
  });

  it("restituisce una stringa vuota senza classi", () => {
    expect(cx(undefined)).toBe("");
  });
});
