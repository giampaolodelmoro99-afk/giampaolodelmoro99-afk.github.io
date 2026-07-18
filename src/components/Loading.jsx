import Window from "./Window";
import Box from "@mui/material/Box";

export default function Loading() {
    return (
    <Box
    sx={{
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    }}
    >
    <Window title="Attendere prego..." sx={{ width: "100%", maxWidth: 500 }}>
        <Box sx={{ padding: "24px 16px", textAlign: "center", fontSize: 16 }}>
            Caricamento in corso ⏳
        </Box>
    </Window>
    </Box>
    );
}