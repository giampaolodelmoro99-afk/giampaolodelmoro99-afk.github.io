import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { RouterProvider, createMemoryRouter, createRoutesStub } from "react-router";

export function renderAt(path: string, element: () => ReactNode) {
  const Stub = createRoutesStub([{ path: "*", Component: element }]);
  return render(<Stub initialEntries={[path]} />);
}

export function renderWithHistory(path: string, element: () => ReactNode) {
  const router = createMemoryRouter([{ path: "*", Component: element }], {
    initialEntries: [path],
  });
  const view = render(<RouterProvider router={router} />);
  return { ...view, router, pathname: () => router.state.location.pathname };
}
