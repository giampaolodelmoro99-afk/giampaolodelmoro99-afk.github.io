import { act } from "@testing-library/react";
import { useLayoutEffect } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithHistory } from "../../../../tests/setup/render";
import type { RouteKey } from "../../../routes/routeMap";
import { type UrlSync, useUrlSync } from "./useUrlSync";

async function run(action: () => unknown) {
  await act(async () => {
    await action();
  });
}

function setup(path: string) {
  const onRoute = vi.fn<(key: RouteKey) => void>();
  const current: { sync: UrlSync | null } = { sync: null };
  function Probe() {
    const sync = useUrlSync(onRoute);
    useLayoutEffect(() => {
      current.sync = sync;
    });
    return null;
  }
  const view = renderWithHistory(path, Probe);
  const api = () => {
    if (!current.sync) throw new Error("hook non montato");
    return current.sync;
  };
  return { ...view, onRoute, api };
}

describe("useUrlSync", () => {
  it("push aggiunge una voce con la route di partenza e non richiama onRoute", async () => {
    const { api, pathname, router, onRoute } = setup("/");
    await run(() => api().push("projects"));
    expect(pathname()).toBe("/progetti/");
    expect(router.state.location.state).toEqual({ back: "/" });
    expect(api().routeKey).toBe("projects");
    expect(onRoute).not.toHaveBeenCalled();
  });

  it("non naviga se l'URL rappresenta già la finestra", async () => {
    const { api, router } = setup("/");
    const key = router.state.location.key;
    await run(() => api().push("about"));
    await run(() => api().settle(null));
    expect(router.state.location.key).toBe(key);
  });

  it("l'assestamento torna indietro se la voce precedente ha già l'URL di destinazione", async () => {
    const { api, pathname, router, onRoute } = setup("/");
    await run(() => api().push("projects"));
    await run(() => api().push("cv"));
    await run(() => api().settle("projects"));
    expect(pathname()).toBe("/progetti/");
    expect(router.state.historyAction).toBe("POP");
    await run(() => router.navigate(1));
    expect(pathname()).toBe("/cv/");
    expect(onRoute).toHaveBeenLastCalledWith("cv");
  });

  it("altrimenti sostituisce la voce corrente, conservando la voce precedente", async () => {
    const { api, pathname, router } = setup("/");
    await run(() => api().push("projects"));
    await run(() => api().push("cv"));
    await run(() => api().settle(null));
    expect(pathname()).toBe("/");
    expect(router.state.historyAction).toBe("REPLACE");
    expect(router.state.location.state).toEqual({ back: "/progetti/" });
  });

  it("su una voce senza stato (link diretto) l'assestamento sostituisce", async () => {
    const { api, pathname, router } = setup("/cv/");
    await run(() => api().settle(null));
    expect(pathname()).toBe("/");
    expect(router.state.historyAction).toBe("REPLACE");
    expect(router.state.location.state).toBeNull();
  });

  it("Indietro, Avanti e i link richiamano onRoute con la route nuova", async () => {
    const { api, router, onRoute } = setup("/");
    await run(() => api().push("projects"));
    await run(() => router.navigate(-1));
    expect(onRoute).toHaveBeenLastCalledWith("desktop");
    await run(() => router.navigate("/contatti/"));
    expect(onRoute).toHaveBeenLastCalledWith("contacts");
  });

  it("il cambio di lingua sulla stessa finestra non richiama onRoute", async () => {
    const { router, onRoute, api } = setup("/progetti/");
    await run(() => router.navigate("/en/projects/"));
    expect(onRoute).not.toHaveBeenCalled();
    await run(() => api().push("cv"));
    expect(router.state.location.pathname).toBe("/en/cv/");
  });

  it("chiudendo una finestra aperta dalla home si torna alla voce della home, che rappresenta About", async () => {
    const { api, pathname, router, onRoute } = setup("/");
    await run(() => api().push("projects"));
    await run(() => api().settle("about"));
    expect(pathname()).toBe("/");
    expect(router.state.historyAction).toBe("POP");
    expect(onRoute).not.toHaveBeenCalled();
  });
});
