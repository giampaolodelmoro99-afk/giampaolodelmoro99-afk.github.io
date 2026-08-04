import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { w95, focusStyle } from "../theme/theme";

function ComputerIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 16 16" shapeRendering="crispEdges">
      <rect x="1" y="1" width="14" height="10" fill={w95.silver} />
      <rect x="2" y="2" width="12" height="8" fill={w95.navy} />
      <rect x="3" y="3" width="6" height="1" fill={w95.teal} />
      <rect x="3" y="5" width="8" height="1" fill={w95.lightest} />
      <rect x="6" y="11" width="4" height="2" fill={w95.dark} />
      <rect x="3" y="13" width="10" height="2" fill={w95.silver} />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 16 16" shapeRendering="crispEdges">
      <rect x="3" y="4" width="10" height="11" fill={w95.silver} />
      <rect x="4" y="5" width="8" height="9" fill={w95.dark} />
      <rect x="5" y="6" width="1" height="7" fill={w95.lightest} />
      <rect x="7" y="6" width="1" height="7" fill={w95.lightest} />
      <rect x="9" y="6" width="1" height="7" fill={w95.lightest} />
      <rect x="2" y="2" width="12" height="2" fill={w95.silver} />
      <rect x="6" y="1" width="4" height="1" fill={w95.silver} />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 16 16" shapeRendering="crispEdges">
      <rect x="1" y="3" width="6" height="2" fill="#e8a200" />
      <rect x="1" y="5" width="14" height="9" fill="#fce97c" />
      <rect x="1" y="5" width="14" height="1" fill="#e8a200" />
      <rect x="1" y="13" width="14" height="1" fill="#a87400" />
      <rect x="14" y="5" width="1" height="9" fill="#a87400" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 16 16" shapeRendering="crispEdges">
      <rect x="3" y="1" width="8" height="14" fill={w95.lightest} />
      <rect x="11" y="4" width="2" height="11" fill={w95.lightest} />
      <rect x="11" y="1" width="1" height="3" fill={w95.dark} />
      <rect x="11" y="3" width="2" height="1" fill={w95.dark} />
      <rect x="4" y="4" width="6" height="1" fill={w95.navy} />
      <rect x="4" y="6" width="7" height="1" fill={w95.navy} />
      <rect x="4" y="8" width="6" height="1" fill={w95.navy} />
      <rect x="4" y="10" width="7" height="1" fill={w95.navy} />
      <rect x="4" y="12" width="5" height="1" fill={w95.navy} />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 16 16" shapeRendering="crispEdges">
      <rect x="1" y="3" width="14" height="10" fill={w95.lightest} />
      <rect x="1" y="3" width="14" height="1" fill={w95.dark} />
      <rect x="1" y="12" width="14" height="1" fill={w95.dark} />
      <rect x="1" y="3" width="1" height="10" fill={w95.dark} />
      <rect x="14" y="3" width="1" height="10" fill={w95.dark} />
      <rect x="2" y="4" width="2" height="1" fill={w95.teal} />
      <rect x="4" y="5" width="2" height="1" fill={w95.teal} />
      <rect x="6" y="6" width="2" height="1" fill={w95.teal} />
      <rect x="8" y="6" width="2" height="1" fill={w95.teal} />
      <rect x="10" y="5" width="2" height="1" fill={w95.teal} />
      <rect x="12" y="4" width="2" height="1" fill={w95.teal} />
      <rect x="7" y="7" width="2" height="1" fill={w95.teal} />
    </svg>
  );
}

const icons = [
  { label: "Il mio computer", Icon: ComputerIcon },
  { label: "Documenti", Icon: DocumentIcon },
  { label: "Progetti", Icon: FolderIcon },
  { label: "Posta in arrivo", Icon: MailIcon },
  { label: "Cestino", Icon: TrashIcon },
];

const iconButtonStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4px",
  width: 88,
  padding: 0,
  border: "none",
  background: "none",
  font: "inherit",
  color: "inherit",
  textAlign: "center",
  cursor: "pointer",
  position: "relative",
  ...focusStyle,
};

const glyphStyle = {
  position: "relative",
  width: 34,
  height: 34,
  lineHeight: 0,
};

const ditherStyle = {
  content: '""',
  position: "absolute",
  inset: 0,
  backgroundImage: `linear-gradient(45deg, ${w95.navy} 25%, transparent 25%, transparent 75%, ${w95.navy} 75%), linear-gradient(45deg, ${w95.navy} 25%, transparent 25%, transparent 75%, ${w95.navy} 75%)`,
  backgroundSize: "4px 4px",
  backgroundPosition: "0 0, 2px 2px",
};

const labelStyle = {
  color: w95.lightest,
  fontSize: 12,
  padding: "0 2px",
  textShadow: "1px 1px #000000",
};

const selectedLabelStyle = {
  color: w95.lightest,
  fontSize: 12,
  padding: "0 2px",
  backgroundColor: w95.navy,
  outline: `1px dotted ${w95.lightest}`,
  outlineOffset: -1,
  textShadow: "none",
};

export default function DesktopIcons() {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!selected) return;
    const clear = () => setSelected(null);
    document.addEventListener("click", clear);
    return () => document.removeEventListener("click", clear);
  }, [selected]);

  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        position: "fixed",
        left: 20,
        top: 100,
        bottom: 20,
        flexDirection: "column",
        flexWrap: "wrap",
        alignContent: "flex-start",
        gap: "24px",
        zIndex: 10,
        userSelect: "none",
      }}
    >
      {icons.map(({ label, Icon }) => (
        <Box
          key={label}
          component="button"
          type="button"
          aria-label={`Icona desktop ${label}`}
          aria-pressed={selected === label}
          onClick={(event) => {
            event.stopPropagation();
            setSelected(label);
          }}
          sx={iconButtonStyle}
        >
          <Box
            sx={
              selected === label
                ? { ...glyphStyle, "&::after": ditherStyle }
                : glyphStyle
            }
          >
            <Icon />
          </Box>
          <Box sx={selected === label ? selectedLabelStyle : labelStyle}>
            {label}
          </Box>
        </Box>
      ))}
    </Box>
  );
}