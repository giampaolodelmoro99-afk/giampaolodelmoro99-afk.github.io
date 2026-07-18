import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { NavLink } from "react-router";
import Window from "../components/Window";
import { w95, sunken } from "../theme/theme";

const contacts = [
  {
    label: "Email",
    value: "giampaolo.delmoro99@gmail.com",
    href: "mailto:giampaolo.delmoro99@gmail.com",
  },
  {
    label: "GitHub",
    value: "giampaolodelmoro99-afk",
    href: "https://github.com/giampaolodelmoro99-afk",
    external: true,
  },
  {
    label: "Telefono",
    value: "+39 389 989 6109",
    href: "tel:+393899896109",
  },
];

export default function Contatti() {
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
        title="Contatti"
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
              marginBottom: "8px",
            }}
          >
            Contattami
          </Box>
          <Box
            component="fieldset"
            sx={{
              border: `1px solid ${w95.dark}`,
              boxShadow: `1px 1px 0 ${w95.lightest} inset, -1px -1px 0 ${w95.lightest}`,
              padding: { xs: "16px", sm: "24px" },
              margin: 0,
              marginBottom: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
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
              rubrica.exe
            </Box>

            {contacts.map(({ label, value, href, external }) => (
              <Box key={label}>
                <Box
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: 12, sm: 13 },
                    marginBottom: "4px",
                  }}
                >
                  {label}:
                </Box>
                <Box
                  component="a"
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  sx={{
                    display: "block",
                    boxShadow: sunken,
                    backgroundColor: w95.lightest,
                    color: w95.navy,
                    textDecoration: "none",
                    fontSize: { xs: "clamp(12px, 3.6vw, 14px)", sm: 18 },
                    padding: "8px 12px",
                    overflowWrap: "break-word",
                    "&:hover": { textDecoration: "underline" },
                    "&:focus-visible": {
                      outline: "1px dotted #000000",
                      outlineOffset: -4,
                    },
                  }}
                >
                  {value}
                </Box>
              </Box>
            ))}
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
              to="/progetti"
              sx={{ fontSize: 14, padding: "10px 24px" }}
            >
              &lt; Torna a Progetti
            </Button>
            <Button
              component={NavLink}
              to="/"
              sx={{ fontSize: 14, padding: "10px 24px" }}
            >
              Vai alla Home &gt;
            </Button>
          </Box>
        </Box>
      </Window>
    </Box>
  );
}