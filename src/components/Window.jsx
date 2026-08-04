import Box from "@mui/material/Box";
import {
  w95,
  raised,
  sunken,
  focusStyle,
  titlebarStyle,
  titlebarGlyphStyle,
  titlebarGlyphIconSize,
} from "../theme/theme";

function MinimizeIcon() {
  return (
    <svg
      width={titlebarGlyphIconSize}
      height={titlebarGlyphIconSize}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <rect x="2" y="10" width="12" height="4" fill={w95.darkest} />
    </svg>
  );
}

function MaximizeIcon() {
  return (
    <svg
      width={titlebarGlyphIconSize}
      height={titlebarGlyphIconSize}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="16" height="16" fill={w95.darkest} />
      <rect x="2" y="6" width="12" height="8" fill={w95.silver} />
    </svg>
  );
}

const disabledGlyphStyle = {
  ...titlebarGlyphStyle,
  color: w95.dark,
  textShadow: `1px 1px 0 ${w95.lightest}`,
};

export default function Window({ title, children, onClose, sx }) {
  return (
    <Box
      sx={{
        backgroundColor: w95.silver,
        boxShadow: raised,
        padding: "3px",
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
    >
      <Box sx={titlebarStyle}>
        <Box>{title}</Box>
        <Box sx={{ display: "flex", gap: "2px", alignItems: "center" }}>
          <Box component="span" aria-hidden="true" sx={titlebarGlyphStyle}>
            <MinimizeIcon />
          </Box>
          <Box component="span" aria-hidden="true" sx={titlebarGlyphStyle}>
            <MaximizeIcon />
          </Box>
          <Box sx={{ width: 2 }} />
          {onClose ? (
            <Box
              component="button"
              onClick={onClose}
              aria-label="Chiudi"
              sx={{
                ...titlebarGlyphStyle,
                ...focusStyle,
                border: "none",
                padding: 0,
                cursor: "pointer",
                fontFamily: "inherit",
                position: "relative",
                "&:active": { boxShadow: sunken },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: "-12px",
                },
              }}
            >
              ✕
            </Box>
          ) : (
            <Box component="span" aria-hidden="true" sx={disabledGlyphStyle}>
              ✕
            </Box>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          boxShadow: sunken,
          margin: "2px",
          padding: 2,
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
