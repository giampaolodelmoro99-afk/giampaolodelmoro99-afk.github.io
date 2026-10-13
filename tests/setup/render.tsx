import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { createRoutesStub } from "react-router";

export function renderAt(path: string, element: () => ReactElement) {
  const Stub = createRoutesStub([{ path: "*", Component: element }]);
  return render(<Stub initialEntries={[path]} />);
}
