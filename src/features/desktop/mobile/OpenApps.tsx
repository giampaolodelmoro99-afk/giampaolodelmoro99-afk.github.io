import { useStore } from "zustand";
import { useT } from "../../../i18n";
import { type AppId, appIds } from "../../../routes/routeMap";
import type { DesktopStore } from "../../../stores/desktop";
import { appDefinition } from "../apps";
import { AppSwitcher } from "./AppSwitcher";

export type OpenAppsProps = {
  store: DesktopStore;
  onOpen: (id: AppId) => void;
  onDismiss: () => void;
  onClosed: (id: AppId) => void;
  onAllClosed: () => void;
};

const isAppId = (value: string): value is AppId => appIds.some((id) => id === value);

export function OpenApps({ store, onOpen, onDismiss, onClosed, onAllClosed }: OpenAppsProps) {
  const t = useT();
  const recent = useStore(store, (state) => state.recent);
  const activeId = useStore(store, (state) => state.activeId);

  return (
    <AppSwitcher
      isOpen
      onOpenChange={(isOpen) => {
        if (!isOpen) onDismiss();
      }}
      title={t.desktop.openApps.replace("{count}", String(recent.length))}
      items={recent.map((id) => ({ id, label: t.apps[id], icon: appDefinition(id).icon }))}
      currentId={activeId}
      closeLabel={(label) => t.desktop.closeApp.replace("{app}", label)}
      closeAllLabel={t.desktop.closeAllApps}
      onOpen={(id) => {
        if (isAppId(id)) onOpen(id);
      }}
      onClose={(id) => {
        if (!isAppId(id)) return;
        store.getState().close(id);
        onClosed(id);
        if (store.getState().recent.length === 0) onDismiss();
      }}
      onCloseAll={() => {
        for (const id of Object.keys(store.getState().windows)) {
          if (isAppId(id)) store.getState().close(id);
        }
        onAllClosed();
        onDismiss();
      }}
    />
  );
}
