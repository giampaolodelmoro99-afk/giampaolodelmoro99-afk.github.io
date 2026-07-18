import { Outlet } from "react-router";
import Box from "@mui/material/Box";
import Navbar from "./Navbar";
import DesktopIcons from "./DesktopIcons";

export default function Layout() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Navbar />
      <DesktopIcons />
      <Box component="main" sx={{ position: "relative", zIndex: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
