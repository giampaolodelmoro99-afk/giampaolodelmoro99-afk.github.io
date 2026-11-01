import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChunkBoundary } from "./ChunkBoundary";

function Broken(): never {
  throw new Error("chunk non caricato");
}

describe("ChunkBoundary", () => {
  it("mostra i figli quando non ci sono errori", () => {
    const onError = vi.fn<() => void>();
    render(
      <ChunkBoundary onError={onError}>
        <p>Esegui</p>
      </ChunkBoundary>,
    );
    expect(screen.getByText("Esegui")).toBeInTheDocument();
    expect(onError).not.toHaveBeenCalled();
  });

  it("con un errore non mostra nulla e avvisa chi lo usa", () => {
    const onError = vi.fn<() => void>();
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { container } = render(
      <ChunkBoundary onError={onError}>
        <Broken />
      </ChunkBoundary>,
    );
    expect(container).toBeEmptyDOMElement();
    expect(onError).toHaveBeenCalledTimes(1);
    vi.restoreAllMocks();
  });
});
