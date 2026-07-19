import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { NavLink } from "react-router";
import Window from "../components/Window";
import { w95 } from "../theme/theme";

const navButtonStyle = {
  fontSize: { xs: 12, sm: 14 },
  padding: { xs: "10px 8px", sm: "10px 24px" },
  flex: { xs: "1 1 0", sm: "0 0 auto" },
  whiteSpace: "nowrap",
};

function DownloadIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <rect x="7" y="1" width="2" height="7" fill="currentColor" />
      <rect x="5" y="6" width="2" height="2" fill="currentColor" />
      <rect x="9" y="6" width="2" height="2" fill="currentColor" />
      <rect x="6" y="8" width="4" height="1" fill="currentColor" />
      <rect x="7" y="9" width="2" height="1" fill="currentColor" />
      <rect x="1" y="11" width="2" height="4" fill="currentColor" />
      <rect x="13" y="11" width="2" height="4" fill="currentColor" />
      <rect x="1" y="14" width="14" height="1" fill="currentColor" />
    </svg>
  );
}

export default function Profilo() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: { xs: "calc(100vh - 80px)" },
        padding: { xs: "12px", sm: "32px" },
      }}
    >
      <Window
        title="Profilo"
        sx={{
          width: "100%",
          maxWidth: 1000,
          minHeight: { xs: "60vh", sm: "auto" },
        }}
      >
        <Box
          sx={{
            padding: { xs: "4px", sm: "16px" },
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              fontSize: { xs: "clamp(26px, 8vw, 33px)", sm: 77 },
              fontWeight: "bold",
              marginBottom: "24px",
            }}
          >
            Profilo
          </Box>

          <Box
            component="fieldset"
            sx={{
              border: `1px solid ${w95.dark}`,
              boxShadow: `1px 1px 0 ${w95.lightest} inset, -1px -1px 0 ${w95.lightest}`,
              padding: { xs: "16px", sm: "24px" },
              margin: 0,
              marginBottom: "24px",
            }}
          >
            <Box
              component="legend"
              sx={{
                fontWeight: "bold",
                padding: "0 12px",
                fontSize: { xs: 14, sm: 30 },
                marginX: "auto",
                textAlign: "center",
              }}
            >
              chi-sono.txt
            </Box>
            <Box
              component="p"
              sx={{
                lineHeight: 1.7,
                marginBottom: "16px",
                fontSize: { xs: 14, sm: 16 },
              }}
            >
              Diplomato al Liceo Scientifico Buonarroti di Pisa con indirizzo
              Scienze Applicate, ho trasformato la mia passione per
              l'informatica in un percorso concreto, frequentando il corso ITS
              Full Stack Developer di Pisa.
            </Box>
            <Box
              component="p"
              sx={{ lineHeight: 1.7, fontSize: { xs: 14, sm: 16 } }}
            >
              La programmazione web è il mio ambiente: amo la complessità che
              sta dietro ogni riga di codice. Sono in costante evoluzione,
              sempre alla ricerca di nuove tecnologie da padroneggiare.
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: { xs: "8px", sm: "12px" },
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Button component={NavLink} to="/" sx={navButtonStyle}>
              &lt; Torna alla Home
            </Button>

            <Box
              sx={{
                order: { xs: -1, sm: 0 },
                width: { xs: "100%", sm: "auto" },
                display: "flex",
                justifyContent: "center",
                flex: { sm: "0 0 auto" },
              }}
            >
              <Button
                component="a"
                href="/cv-gianpaolo-del-moro.pdf"
                download
                startIcon={<DownloadIcon />}
                sx={{
                  fontSize: { xs: 12, sm: 14 },
                  padding: { xs: "10px 16px", sm: "10px 24px" },
                }}
              >
                Scarica CV
              </Button>
            </Box>

            <Button component={NavLink} to="/stack" sx={navButtonStyle}>
              Vai a Stack &gt;
            </Button>
          </Box>
        </Box>
      </Window>
    </Box>
  );
}