import { createContext } from "react";
import type { AppId } from "../../../routes/routeMap";

export const OpenAppContext = createContext<((id: AppId) => void) | null>(null);
