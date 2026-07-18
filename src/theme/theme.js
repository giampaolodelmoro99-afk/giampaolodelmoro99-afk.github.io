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
                    minWidth: 75,
                    minHeight: 23,
                    padding: "0 12px",
                    fontSize: 11,
                    "&:hover": {
                        backgroundColor: w95.silver,
                        boxShadow: raised,
                    },
                    "&:active": {
                        boxShadow: sunken,
                        paddingTop: 2,
                        paddingLeft: 14,
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