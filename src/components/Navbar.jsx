import { useState } from "react";
import { NavLink } from "react-router";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import {
  w95,
  raised,
  sunken,
  focusStyle,
  titlebarStyle,
  titlebarGlyphStyle,
  controlMetrics,
  scaleUi,
} from "../theme/theme";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/profilo", label: "Profilo" },
  { to: "/stack", label: "Stack" },
  { to: "/progetti", label: "Progetti" },
  { to: "/contatti", label: "Contatti" },
];

const linkStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: w95.silver,
  color: "#000000",
  textDecoration: "none",
  fontSize: controlMetrics.fontSize,
  minHeight: controlMetrics.minHeight,
  padding: `0 ${controlMetrics.paddingX}px`,
  boxShadow: raised,
  whiteSpace: "nowrap",
  ...focusStyle,
  "&:active": {
    boxShadow: sunken,
    paddingTop: `${controlMetrics.pressOffset}px`,
    paddingLeft: `${controlMetrics.paddingX + controlMetrics.pressOffset}px`,
  },
  "&.active": {
    boxShadow: sunken,
    fontWeight: "bold",
    paddingTop: `${controlMetrics.pressOffset}px`,
    paddingLeft: `${controlMetrics.paddingX + controlMetrics.pressOffset}px`,
  },
};

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        component="nav"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: w95.silver,
          boxShadow: raised,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: {
            xs: `${scaleUi(6)}px ${scaleUi(10)}px`,
            sm: `${scaleUi(12)}px ${scaleUi(16)}px`,
          },
        }}
      >
        <Box
          sx={{
            fontWeight: "bold",
            fontSize: { xs: scaleUi(14), sm: scaleUi(16) },
            marginRight: "auto",
          }}
        >
          {"<GDM/>.exe"}
        </Box>

        <Box sx={{ display: { xs: "none", sm: "flex" }, gap: "6px" }}>
          {links.map((link) => (
            <Box
              key={link.to}
              component={NavLink}
              to={link.to}
              end={link.end}
              sx={linkStyle}
            >
              {link.label}
            </Box>
          ))}
        </Box>

        <Box
          component="button"
          aria-label="Apri menu"
          onClick={(e) => {
            e.currentTarget.blur();
            setOpen(true);
          }}
          sx={{
            display: { xs: "flex", sm: "none" },
            border: "none",
            backgroundColor: w95.silver,
            boxShadow: raised,
            fontFamily: "inherit",
            fontSize: { xs: scaleUi(20), sm: scaleUi(26) },
            fontWeight: "bold",
            padding: {
              xs: `${scaleUi(6)}px ${scaleUi(14)}px`,
              sm: `${scaleUi(10)}px ${scaleUi(18)}px`,
            },
            cursor: "pointer",
            ...focusStyle,
            "&:active": { boxShadow: sunken },
          }}
        >
          ≡
        </Box>
      </Box>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: w95.silver,
              boxShadow: raised,
              borderRadius: 0,
              width: 220,
              padding: "3px",
            },
          },
        }}
      >
        <Box sx={titlebarStyle}>
          <Box>Menu</Box>
          <Box
            component="button"
            aria-label="Chiudi menu"
            onClick={() => setOpen(false)}
            sx={{
              ...titlebarGlyphStyle,
              ...focusStyle,
              border: "none",
              padding: 0,
              fontFamily: "inherit",
              cursor: "pointer",
              "&:active": { boxShadow: sunken },
            }}
          >
            ✕
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            padding: "10px",
          }}
        >
          {links.map((link) => (
            <Box
              key={link.to}
              component={NavLink}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              sx={{ ...linkStyle, textAlign: "center" }}
            >
              {link.label}
            </Box>
          ))}
        </Box>
      </Drawer>
    </>
  );
}
