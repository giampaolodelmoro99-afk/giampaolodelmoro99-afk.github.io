import type { StorybookConfig } from "@storybook/react-vite";
import type { PluginOption } from "vite";

const withoutReactRouter = (plugins: PluginOption[] = []): PluginOption[] =>
  plugins
    .flat()
    .filter(
      (plugin) =>
        !(
          plugin &&
          typeof plugin === "object" &&
          "name" in plugin &&
          plugin.name.startsWith("react-router")
        ),
    );

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["./docs/*.mdx", "./docs/*.stories.tsx", "../src/**/*.mdx", "../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
  viteFinal: (viteConfig) => ({ ...viteConfig, plugins: withoutReactRouter(viteConfig.plugins) }),
};

export default config;
