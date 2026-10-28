import { describe, expect, it } from "vitest";
import { iconSizes } from "../../components/Icon";
import { appIds } from "../../routes/routeMap";
import { appDefinition, apps, desktopApps, homeApp, openAppFor } from "./apps";

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

  it("apre About sulla home e l'app della route altrove", () => {
    expect(openAppFor("desktop")).toBe(homeApp);
    expect(openAppFor("projects")).toBe("projects");
    expect(appDefinition("terminal").variant).toBe("app");
  });
});
