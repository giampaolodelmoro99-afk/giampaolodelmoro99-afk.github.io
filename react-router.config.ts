import type { Config } from "@react-router/dev/config";
import { prerenderPaths } from "./src/routes/routeMap";

export default {
  appDirectory: "src/app",
  buildDirectory: "build",
  ssr: false,
  prerender: prerenderPaths(),
  routeDiscovery: { mode: "initial" },
} satisfies Config;
