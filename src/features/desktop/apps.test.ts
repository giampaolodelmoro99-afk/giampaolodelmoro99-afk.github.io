import { describe, expect, it } from "vitest";
import { iconSizes } from "../../components/Icon";
import { appIds } from "../../routes/routeMap";
import { appDefinition, apps, desktopApps, startMenuApps, startMenuSystemApps } from "./apps";

describe("registro delle app", () => {
  it("ha una voce per ogni app della routeMap, una volta sola", () => {
    expect(apps.map((app) => app.id).toSorted()).toEqual([...appIds].toSorted());
  });

  it("mette sul desktop 11 icone, con Vista semplice dopo Contatti", () => {
    const ids = desktopApps.map((app) => app.id);
    expect(ids).toHaveLength(11);
    expect(ids.indexOf("simpleView")).toBe(ids.indexOf("contacts") + 1);
    expect(ids).not.toContain("controlPanel");
    expect(ids).not.toContain("privacy");
  });

  it("usa icone che esistono a 16 e 32 px", () => {
    for (const app of apps) {
      expect(iconSizes[app.icon]).toEqual([16, 32]);
    }
  });

  it("distingue le app con il corpo documento", () => {
    expect(appDefinition("about").variant).toBe("document");
    expect(appDefinition("terminal").variant).toBe("app");
  });

  it("il menu Start elenca le app senza il Cestino, con Pannello di controllo e Vista semplice in fondo", () => {
    const all = [...startMenuApps, ...startMenuSystemApps];
    expect(new Set(all).size).toBe(all.length);
    expect(all).not.toContain("trash");
    expect(startMenuApps.at(-1)).toBe("privacy");
    expect(startMenuSystemApps).toEqual(["controlPanel", "simpleView"]);
  });
});
