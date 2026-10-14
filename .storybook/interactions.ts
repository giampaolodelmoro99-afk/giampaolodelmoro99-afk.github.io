import { expect, userEvent, waitFor } from "storybook/test";

// Aiuti per le funzioni play delle story fotografate dai test visivi.
//
// Gli stati di hover e pressione si creano con eventi sintetici. Il mouse reale
// di Playwright resta però in (0, 0): quando l'overlay di caricamento di
// Storybook sparisce, al frame successivo Chrome invia un pointerover reale sul
// body, e React Aria chiude hover e pressione. Per questo si aspetta che il
// layout sia stabile (font e due frame) prima di creare lo stato.

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

export async function afterLayout() {
  await document.fonts.ready;
  await nextFrame();
  await nextFrame();
}

export async function hover(element: Element) {
  await afterLayout();
  await userEvent.hover(element);
  await waitFor(() => expect(element).toHaveAttribute("data-hovered", "true"));
}

export async function press(element: Element) {
  await afterLayout();
  await userEvent.pointer({ keys: "[MouseLeft>]", target: element });
  await waitFor(() => expect(element).toHaveAttribute("data-pressed", "true"));
}

export async function focusWithKeyboard(element: Element) {
  await afterLayout();
  await userEvent.tab();
  await waitFor(() => expect(element).toHaveAttribute("data-focus-visible", "true"));
}
