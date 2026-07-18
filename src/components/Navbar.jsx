import { useState } from "react";
import { NavLink } from "react-router";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { w95, raised, sunken } from "../theme/theme";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/profilo", label: "Profilo" },
  { to: "/stack", label: "Stack" },
  { to: "/progetti", label: "Progetti" },
  { to: "/contatti", label: "Contatti" },
];

const linkStyle = {
  backgroundColor: w95.silver,
  color: "#000",
  textDecoration: "none",
  fontSize: 14,
  padding: "8px 20px",
  boxShadow: raised,
  whiteSpace: "nowrap",
  "&:active": { boxShadow: sunken },
  "&.active": { boxShadow: sunken, fontWeight: "bold" },
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
          padding: { xs: "6px 10px", sm: "12px 16px" },
        }}
      >
        <Box
          sx={{
            fontWeight: "bold",
            fontSize: { xs: 16, sm: 24 },
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
            fontSize: { xs: 20, sm: 26 },
            fontWeight: "bold",
            padding: { xs: "6px 14px", sm: "10px 18px" },
            cursor: "pointer",
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
        <Box
          sx={{
            backgroundColor: w95.navy,
            color: "#fff",
            fontWeight: "bold",
            fontSize: 26,
            padding: "10px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Menu
          <Box
            component="button"
            aria-label="Chiudi menu"
            onClick={() => setOpen(false)}
            sx={{
              border: "none",
              backgroundColor: w95.silver,
              boxShadow: raised,
              fontFamily: "inherit",
              fontSize: 12,
              fontWeight: "bold",
              width: 22,
              height: 20,
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
