import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { w95, raised, sunken } from "../theme/theme";

const glyphStyle = {
  width: 16,
  height: 14,
  backgroundColor: w95.silver,
  boxShadow: raised,
  fontSize: 10,
  fontWeight: "bold",
  lineHeight: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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
      <Box
        sx={{
          backgroundColor: w95.navy,
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 18,
          padding: "2px 3px",
          userSelect: "none",
        }}
      >
        <Typography sx={{ fontWeight: "bold", fontSize: 11, lineHeight: 1 }}>
          {title}
        </Typography>
        <Box sx={{ display: "flex", gap: "2px", alignItems: "center" }}>
          <Box component="span" aria-hidden="true" sx={glyphStyle}>
            _
          </Box>
          <Box component="span" aria-hidden="true" sx={glyphStyle}>
            □
          </Box>
          <Box sx={{ width: 2 }} />
          <Box
            component="button"
            onClick={onClose}
            aria-label="Chiudi"
            sx={{
              ...glyphStyle,
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
        </Box>
      </Box>
      <Box
        sx={{
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
