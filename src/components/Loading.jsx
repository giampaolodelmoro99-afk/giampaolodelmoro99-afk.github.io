import Box from "@mui/material/Box";
import Window from "./Window";
import {
  pageMinHeight,
  windowMaxWidth,
  progressBarStyle,
  progressFillStyle,
} from "../theme/theme";

export default function Loading() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        minHeight: pageMinHeight,
        padding: { xs: "12px", sm: "32px" },
      }}
    >
      <Window title="Attendere prego..." sx={{ width: "100%", maxWidth: windowMaxWidth }}>
        <Box sx={{ padding: { xs: "4px", sm: "16px" } }}>
          <Box
            sx={{
              fontSize: { xs: 14, sm: 16 },
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Caricamento in corso
          </Box>
          <Box
            role="progressbar"
            aria-label="Caricamento in corso"
            sx={progressBarStyle}
          >
            <Box
              sx={{
                ...progressFillStyle,
                animation: "caricamento 2s steps(10) infinite",
                "@keyframes caricamento": {
                  from: { width: "0%" },
                  to: { width: "100%" },
                },
              }}
            />
          </Box>
        </Box>
      </Window>
    </Box>
  );
}
