import { createTheme } from "@mui/material/styles";
import msSansSerif from "../assets/fonts/ms_sans_serif.woff2";
import msSansSerifBold from "../assets/fonts/ms_sans_serif_bold.woff2";

export const w95 = {
    silver: "#c0c0c0",
    lightest: "#ffffff",
    light: "#dfdfdf",
    dark: "#808080",
    darkest: "#0a0a0a",
    navy: "#000080",
    teal: "#008080",
};

export const raised = `inset -1px -1px ${w95.darkest}, inset 1px 1px ${w95.lightest}, inset -2px -2px ${w95.dark}, inset 2px 2px ${w95.light}`;

export const sunken = `inset -1px -1px ${w95.lightest}, inset 1px 1px ${w95.darkest}, inset -2px -2px ${w95.light}, inset 2px 2px ${w95.dark}`;

export const focusStyle = {
    "&:focus-visible": {
        outline: "1px dotted #000000",
        outlineOffset: -3,
    },
};

// Windows 95 girava a 640x480: font dei controlli 11px, pulsanti 23px
// (rapporto 2.1). uiScale riporta quelle proporzioni su un viewport moderno:
// è l'unico valore da cambiare per riscalare tutti i controlli.
export const uiScale = 15 / 11;

const controlRatio = 2.1;

export const scaleUi = (value) => Math.round(value * uiScale);

export const controlMetrics = {
    fontSize: scaleUi(11),
    minHeight: Math.round(scaleUi(11) * controlRatio),
    minWidth: scaleUi(75),
    paddingX: scaleUi(12),
    pressOffset: scaleUi(2),
};

export const titlebarGlyphIconSize = scaleUi(8);

export const titlebarStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: scaleUi(19),
    padding: `${scaleUi(2)}px ${scaleUi(3)}px`,
    backgroundColor: w95.navy,
    color: w95.lightest,
    fontSize: controlMetrics.fontSize,
    fontWeight: "bold",
    lineHeight: 1,
    userSelect: "none",
};

export const titlebarGlyphStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: scaleUi(16),
    height: scaleUi(14),
    backgroundColor: w95.silver,
    boxShadow: raised,
    fontSize: scaleUi(10),
    fontWeight: "bold",
    lineHeight: 1,
};

export const navButtonStyle = {
    flex: { xs: "1 1 0", sm: "0 0 auto" },
    whiteSpace: "nowrap",
};

export const progressBarStyle = {
    height: 20,
    boxShadow: sunken,
    backgroundColor: w95.silver,
    padding: "3px",
    overflow: "hidden",
};

export const progressFillStyle = {
    height: "100%",
    backgroundImage: `repeating-linear-gradient(90deg, ${w95.navy} 0 10px, transparent 10px 13px)`,
};

const scrollbarRect = (x, y, w, h) =>
    `<rect x='${x}' y='${y}' width='${w}' height='${h}' fill='%23${w95.darkest.slice(1)}'/>`;

const scrollbarArrow = (rects) =>
    `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'>${rects}</svg>")`;

const arrowUp = scrollbarArrow(
    scrollbarRect(7, 6, 1, 1) +
        scrollbarRect(6, 7, 3, 1) +
        scrollbarRect(5, 8, 5, 1) +
        scrollbarRect(4, 9, 7, 1)
);

const arrowDown = scrollbarArrow(
    scrollbarRect(4, 6, 7, 1) +
        scrollbarRect(5, 7, 5, 1) +
        scrollbarRect(6, 8, 3, 1) +
        scrollbarRect(7, 9, 1, 1)
);

const arrowLeft = scrollbarArrow(
    scrollbarRect(6, 7, 1, 1) +
        scrollbarRect(7, 6, 1, 3) +
        scrollbarRect(8, 5, 1, 5) +
        scrollbarRect(9, 4, 1, 7)
);

const arrowRight = scrollbarArrow(
    scrollbarRect(6, 4, 1, 7) +
        scrollbarRect(7, 5, 1, 5) +
        scrollbarRect(8, 6, 1, 3) +
        scrollbarRect(9, 7, 1, 1)
);

const ditherTrack = `linear-gradient(45deg, ${w95.lightest} 25%, transparent 25%, transparent 75%, ${w95.lightest} 75%), linear-gradient(45deg, ${w95.lightest} 25%, transparent 25%, transparent 75%, ${w95.lightest} 75%)`;

export const navbarHeight = { xs: 64, sm: 65 };

export const pageMinHeight = {
    xs: `calc(100vh - ${navbarHeight.xs}px)`,
    sm: `calc(100vh - ${navbarHeight.sm}px)`,
};

const theme = createTheme({
    palette: {
        primary: { main: w95.navy },
        background: { default: w95.teal, paper: w95.silver },
        text: { primary: "#000000" },
    },
    typography: {
        fontFamily: '"Pixelated MS Sans Serif", Arial, sans-serif',
        fontSize: 11,
        button: { textTransform: "none" },
    },
    shape: { borderRadius: 0 },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
                @font-face {
                font-family: "Pixelated MS Sans Serif";
                src: url(${msSansSerif}) format("woff2");
                font-weight: normal;
                font-display: swap;
                }
                @font-face {
                font-family: "Pixelated MS Sans Serif";
                src: url(${msSansSerifBold}) format("woff2");
                font-weight: bold;
                font-display: swap;
                }
                body {
                -webkit-font-smoothing: none;
                }
                a, button {
                touch-action: manipulation;
                }
                ::selection {
                background-color: ${w95.navy};
                color: ${w95.lightest};
                }
                @supports not selector(::-webkit-scrollbar) {
                html {
                scrollbar-color: ${w95.silver} ${w95.dark};
                scrollbar-width: auto;
                }
                }
                *::-webkit-scrollbar {
                width: 16px;
                height: 16px;
                }
                *::-webkit-scrollbar-track {
                background-color: ${w95.silver};
                background-image: ${ditherTrack};
                background-size: 4px 4px;
                background-position: 0 0, 2px 2px;
                }
                *::-webkit-scrollbar-thumb {
                background-color: ${w95.silver};
                box-shadow: ${raised};
                }
                *::-webkit-scrollbar-corner {
                background-color: ${w95.silver};
                }
                *::-webkit-scrollbar-button:single-button {
                display: block;
                width: 16px;
                height: 16px;
                background-color: ${w95.silver};
                background-repeat: no-repeat;
                background-position: center;
                box-shadow: ${raised};
                }
                *::-webkit-scrollbar-button:single-button:vertical:decrement {
                background-image: ${arrowUp};
                }
                *::-webkit-scrollbar-button:single-button:vertical:increment {
                background-image: ${arrowDown};
                }
                *::-webkit-scrollbar-button:single-button:horizontal:decrement {
                background-image: ${arrowLeft};
                }
                *::-webkit-scrollbar-button:single-button:horizontal:increment {
                background-image: ${arrowRight};
                }
                *::-webkit-scrollbar-button:single-button:active {
                box-shadow: ${sunken};
                }
            `,
        },
        MuiButtonBase: {
            defaultProps: { disableRipple: true },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: w95.silver,
                    color: "#000000",
                    boxShadow: raised,
                    border: "none",
                    borderRadius: 0,
                    minWidth: controlMetrics.minWidth,
                    minHeight: controlMetrics.minHeight,
                    padding: `0 ${controlMetrics.paddingX}px`,
                    fontSize: controlMetrics.fontSize,
                    "&:hover": {
                        backgroundColor: w95.silver,
                        boxShadow: raised,
                    },
                    "&:active": {
                        boxShadow: sunken,
                        paddingTop: controlMetrics.pressOffset,
                        paddingLeft:
                            controlMetrics.paddingX + controlMetrics.pressOffset,
                    },
                    "&:focus-visible": {
                        outline: "1px dotted #000000",
                        outlineOffset: -5,
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: w95.silver,
                    boxShadow: raised,
                    borderRadius: 0,
                    backgroundImage: "none",
                },
            },
        },
    },
});

export default theme;