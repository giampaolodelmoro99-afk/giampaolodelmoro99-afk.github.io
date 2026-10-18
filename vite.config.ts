import optimizeLocales from "@react-aria/optimize-locales-plugin";
import { reactRouter } from "@react-router/dev/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import { intlLocales } from "./src/routes/routeMap.ts";

const bundleReport = () =>
  Object.assign(
    visualizer({
      filename: "build/stats.html",
      template: "treemap",
      gzipSize: true,
      brotliSize: false,
    }),
    { applyToEnvironment: (environment: { name: string }) => environment.name === "client" },
  );

export default defineConfig({
  plugins: [
    optimizeLocales.vite({ locales: Object.values(intlLocales) }),
    reactRouter(),
    process.env["ANALYZE"] === "1" && bundleReport(),
  ],
  build: {
    assetsInlineLimit: 0,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "framework",
              test: /[\\/]node_modules[\\/](react|react-dom|react-router|scheduler|cookie|set-cookie-parser)[\\/]/,
            },
          ],
        },
      },
    },
  },
});
