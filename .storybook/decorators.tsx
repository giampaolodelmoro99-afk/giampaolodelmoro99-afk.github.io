import type { Decorator } from "@storybook/react-vite";
import { UNSAFE_PortalProvider } from "react-aria/PortalProvider";
import styles from "./decorators.module.css";

export const overlaysInStoryRoot: Decorator = (Story) => (
  <UNSAFE_PortalProvider getContainer={() => document.getElementById("storybook-root")}>
    <Story />
  </UNSAFE_PortalProvider>
);

export const modalStage: Decorator = (Story) => (
  <div className={styles.modalStage}>
    <Story />
  </div>
);
