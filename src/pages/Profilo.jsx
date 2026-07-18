import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { NavLink } from "react-router";
import Window from "../components/Window";
import { w95 } from "../theme/theme";

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
                fontSize: { xs: 14, sm: 22 },
              }}
            >
              Diplomato al Liceo Scientifico Buonarroti di Pisa con indirizzo
              Scienze Applicate, ho trasformato la mia passione per
              l'informatica in un percorso concreto, frequentando il corso ITS
              Full Stack Developer di Pisa.
            </Box>
            <Box
              component="p"
              sx={{ lineHeight: 1.7, fontSize: { xs: 14, sm: 22 } }}
            >
              La programmazione web è il mio ambiente: amo la complessità che
              sta dietro ogni riga di codice. Sono in costante evoluzione,
              sempre alla ricerca di nuove tecnologie da padroneggiare.
            </Box>
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
              component="a"
              href="/cv-gianpaolo-del-moro.pdf"
              download
              sx={{ fontSize: { xs: 14, sm: 16 }, padding: "10px 24px" }}
            >
              Scarica CV
            </Button>
            <Button
              component={NavLink}
              to="/stack"
              sx={{
                display: { xs: "inline-flex", sm: "none" },
                fontSize: 14,
                padding: "10px 24px",
              }}
            >
              Vai a Stack
            </Button>
          </Box>
        </Box>
      </Window>
    </Box>
  );
}