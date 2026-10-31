import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { type ResizeEdge, resizeEdges } from "./edges";
import { ResizeHandles } from "./ResizeHandles";

describe("ResizeHandles", () => {
  it("disegna otto maniglie decorative, una per bordo e angolo", () => {
    const { container } = render(<ResizeHandles onResizeStart={() => {}} />);
    const root = container.firstElementChild;
    expect(root).toHaveAttribute("aria-hidden", "true");
    const edges = [...container.querySelectorAll("[data-edge]")].map((handle) =>
      handle.getAttribute("data-edge"),
    );
    expect(edges).toEqual([...resizeEdges]);
  });

  it("segnala il bordo premuto con l'evento del puntatore", () => {
    const onResizeStart = vi.fn<(edge: ResizeEdge, event: PointerEvent) => void>();
    const { container } = render(<ResizeHandles onResizeStart={onResizeStart} />);
    const handle = container.querySelector('[data-edge="se"]');
    if (!handle) throw new Error("maniglia mancante");
    fireEvent.pointerDown(handle, { button: 0 });
    expect(onResizeStart).toHaveBeenCalledWith("se", expect.any(Event));
    fireEvent.pointerDown(container.firstElementChild ?? handle);
    expect(onResizeStart).toHaveBeenCalledTimes(1);
  });

  it("mostra le maniglie durante il ridimensionamento", () => {
    const { container } = render(<ResizeHandles isResizing onResizeStart={() => {}} />);
    expect(container.firstElementChild).toHaveAttribute("data-resizing", "true");
  });

  it("non ha violazioni axe", async () => {
    const { container } = render(<ResizeHandles onResizeStart={() => {}} />);
    await expectNoAxeViolations(container);
  });
});
