import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { NavLink } from "react-router";
import Window from "../components/Window";
import { sunken } from "../theme/theme";

export default function Home() {
  const [shutdown, setShutdown] = useState(false);

  if (shutdown) {
    return (
      <Box
        onClick={() => setShutdown(false)}
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          backgroundColor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <Box
          sx={{
            color: "#ffa500",
            fontSize: { xs: 18, sm: 33 },
            fontWeight: "bold",
            lineHeight: 1.5,
          }}
        >
          Please wait while your computer shuts down...
          <Box
            sx={{
              fontSize: { xs: 11, sm: 14 },
              marginTop: "20px",
              color: "#808080",
            }}
          >
            (clicca ovunque per riaccendere)
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: { xs: "12px", sm: "32px" },
        minHeight: { xs: "calc(100vh - 80px)" },
      }}
    >
      <Window
        title="Benvenuto"
        sx={{
          width: "100%",
          maxWidth: 1000,
          minHeight: { xs: "60vh", sm: "auto" },
        }}
        onClose={() => setShutdown(true)}
      >
        <Box
          sx={{
            padding: { xs: "20px 8px", sm: "48px 32px" },
            textAlign: "center",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              fontSize: { xs: "clamp(30px, 10vw, 44px)", sm: 77 },
              fontWeight: "bold",
              lineHeight: 1.2,
              marginBottom: "24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box component="span" sx={{ display: { xs: "block", sm: "inline" } }}>
              Gianpaolo
            </Box>
            <Box component="span" sx={{ display: { xs: "block", sm: "inline" } }}>
              Del Moro
            </Box>
          </Box>

          <Box>
            <Box
              sx={{
                backgroundColor: "#000000",
                color: "#c0c0c0",
                fontFamily: '"Courier New", monospace',
                fontSize: { xs: "clamp(8px, 2.3vw, 12px)", sm: 20 },
                padding: { xs: "12px 10px", sm: "18px 20px" },
                boxShadow: sunken,
                marginBottom: "24px",
                overflowX: "auto",
                whiteSpace: "nowrap",
                display: "inline-block",
                maxWidth: "100%",
              }}
            >
              while(true) {"{"} sudo apt install -y coffee; code(); {"}"}
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: "0.6em",
                  marginLeft: "2px",
                  backgroundColor: "#c0c0c0",
                  animation: "blink 1s steps(1) infinite",
                  "@keyframes blink": {
                    "0%, 49%": { opacity: 1 },
                    "50%, 100%": { opacity: 0 },
                  },
                }}
              >
                &nbsp;
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              fontSize: { xs: "clamp(13px, 4vw, 16px)", sm: 22 },
              lineHeight: 1.6,
              marginBottom: "32px",
            }}
          >
            Studente ITS Full Stack Developer
            <br />
            in cerca di una prima esperienza lavorativa
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              component={NavLink}
              to="/profilo"
              sx={{ fontSize: 14, padding: "10px 24px" }}
            >
              Vai a Profilo &gt;
            </Button>
          </Box>
        </Box>
      </Window>
    </Box>
  );
}