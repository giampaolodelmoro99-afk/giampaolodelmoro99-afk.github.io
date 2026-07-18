import Box from "@mui/material/Box";
import { w95 } from "../theme/theme";

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

export default function DesktopIcons() {
  return (
    <Box
      aria-hidden="true" 
      sx={{
        display: { xs: "none", md: "flex" },
        position: "fixed",
        left: 20,
        top: 100,
        bottom: 20,
        flexDirection: "column",
        flexWrap: "wrap",
        alignContent: "flex-start",
        gap: "26px",
        zIndex: 10, 
        userSelect: "none",
      }}
    >
      {icons.map(({ label, Icon }) => (
        <Box
          key={label}
          component="div" 
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            width: 90,
            textAlign: "center",
            cursor: "pointer",
            position: "relative", 
            "&:hover": {
              cursor: "pointer", 
            }
          }}
        >
          <Icon />
          <Box
            sx={{ color: "#ffffff", fontSize: 12, textShadow: "1px 1px #000" }}
          >
            {label}
          </Box>
        </Box>
      ))}
    </Box>
  );
}