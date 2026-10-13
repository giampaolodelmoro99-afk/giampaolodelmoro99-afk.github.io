import type { ReactNode } from "react";
import { RouterProvider } from "react-aria-components";
import { type NavigateOptions, useHref, useNavigate } from "react-router";

export function AriaRouterProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return (
    <RouterProvider
      navigate={(href: string, options?: NavigateOptions) => void navigate(href, options)}
      useHref={useHref}
    >
      {children}
    </RouterProvider>
  );
}
