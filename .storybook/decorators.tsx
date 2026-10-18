import type { Decorator } from "@storybook/react-vite";
import { UNSAFE_PortalProvider } from "react-aria/PortalProvider";

export const overlaysInStoryRoot: Decorator = (Story) => (
  <UNSAFE_PortalProvider getContainer={() => document.getElementById("storybook-root")}>
    <Story />
  </UNSAFE_PortalProvider>
);
