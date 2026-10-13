import type { Decorator, Preview } from "@storybook/react-vite";
import { type Settings, SettingsFrame } from "./SettingsFrame";
import "../src/styles/global.css";

const defaults: Settings = {
  theme: "classic",
  font: "auto",
  input: "auto",
  motion: "auto",
  textSize: "100%",
  locale: "it",
};

const withSettings: Decorator = (Story, context) => (
  <SettingsFrame settings={{ ...defaults, ...context.globals }}>
    <Story />
  </SettingsFrame>
);

const preview: Preview = {
  decorators: [withSettings],
  initialGlobals: defaults,
  globalTypes: {
    theme: {
      description: "Tema",
      toolbar: {
        title: "Tema",
        icon: "contrast",
        dynamicTitle: true,
        items: [
          { value: "classic", title: "Classico" },
          { value: "high-contrast", title: "Alto contrasto" },
        ],
      },
    },
    font: {
      description: "Font dell'interfaccia",
      toolbar: {
        title: "Font",
        icon: "paragraph",
        dynamicTitle: true,
        items: [
          { value: "auto", title: "Predefinito del tema" },
          { value: "pixel", title: "Pixel" },
          { value: "readable", title: "Leggibile" },
        ],
      },
    },
    input: {
      description: "Modalità dei controlli",
      toolbar: {
        title: "Input",
        icon: "mobile",
        dynamicTitle: true,
        items: [
          { value: "auto", title: "Automatico (pointer)" },
          { value: "mouse", title: "Mouse" },
          { value: "touch", title: "Touch" },
        ],
      },
    },
    motion: {
      description: "Movimento",
      toolbar: {
        title: "Movimento",
        icon: "play",
        dynamicTitle: true,
        items: [
          { value: "auto", title: "Di sistema" },
          { value: "reduce", title: "Ridotto" },
        ],
      },
    },
    textSize: {
      description: "Dimensione del testo",
      toolbar: {
        title: "Testo",
        icon: "zoom",
        dynamicTitle: true,
        items: [
          { value: "100%", title: "100%" },
          { value: "112.5%", title: "112,5%" },
          { value: "125%", title: "125%" },
        ],
      },
    },
    locale: {
      description: "Lingua",
      toolbar: {
        title: "Lingua",
        icon: "globe",
        dynamicTitle: true,
        items: [
          { value: "it", title: "Italiano" },
          { value: "en", title: "English" },
        ],
      },
    },
  },
  parameters: {
    layout: "padded",
    a11y: { test: "error" },
    backgrounds: { disable: true },
  },
};

export default preview;
