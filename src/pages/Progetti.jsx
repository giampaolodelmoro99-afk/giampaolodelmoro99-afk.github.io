import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { NavLink } from "react-router";
import Window from "../components/Window";
import { w95, raised, sunken } from "../theme/theme";

const projects = [
  {
    name: "task-manager.exe",
    description:
      "API RESTful per gestire task, note e utenti, con autenticazione JWT, previsioni meteo integrate (OpenWeather) e assistente IA basato su Google Gemini.",
    tech: ["Node.js", "Express", "MariaDB", "JWT", "Gemini AI"],
    url: "https://github.com/giampaolodelmoro99-afk/task-manager-node",
  },
  {
    name: "biblioteca.exe",
    description:
      "Sistema di gestione per biblioteche e cataloghi di libri, con relazioni many-to-many tra libri, autori e categorie tramite tabelle pivot ottimizzate.",
    tech: ["Laravel", "PHP", "MySQL"],
    url: "https://github.com/giampaolodelmoro99-afk/laravel-library-management-system-backend",
  },
  {
    name: "store-manager.exe",
    description:
      "Backend per la gestione di un negozio: clienti, ordini e prodotti, con carrelli multi-prodotto gestiti tramite tabella pivot order_product.",
    tech: ["Laravel", "PHP", "MySQL"],
    url: "https://github.com/giampaolodelmoro99-afk/laravel-store-backend",
  },
  {
    name: "rubrica.exe",
    description:
      "API per una rubrica telefonica protetta: autenticazione JWT, isolamento dei dati tra utenti, integrità referenziale con ON DELETE CASCADE e architettura pulita.",
    tech: ["Node.js", "Express", "MariaDB", "JWT"],
    url: "https://github.com/giampaolodelmoro99-afk/progetto-node-rubrica",
  },
  {
    name: "task-notes.exe",
    description:
      "Sistema full stack di gestione attività e note: API RESTful in Laravel con autenticazione Sanctum e frontend in JavaScript vanilla.",
    tech: ["Laravel", "Sanctum", "JavaScript", "MySQL", "Docker"],
    url: "https://github.com/giampaolodelmoro99-afk/laravel-task-manager",
  },
  {
    name: "gestione-spese.exe",
    description:
      "Expense tracker con categorie personalizzate di entrate e uscite, calcolo del bilancio ed eliminazione a cascata per mantenere il database pulito.",
    tech: ["Node.js", "Express", "MariaDB", "JWT"],
    url: "https://github.com/giampaolodelmoro99-afk/gestione-spese-node",
  },
];

function ProjectCard({ name, description, tech, url }) {
  return (
    <Box
      sx={{
        backgroundColor: w95.silver,
        boxShadow: raised,
        padding: "3px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          backgroundColor: w95.navy,
          color: "#ffffff",
          fontWeight: "bold",
          fontSize: { xs: 12, sm: 14 },
          padding: "4px 8px",
          userSelect: "none",
        }}
      >
        {name}
      </Box>

      <Box
        sx={{
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          flex: 1,
        }}
      >
        <Box sx={{ fontSize: { xs: 13, sm: 14 }, lineHeight: 1.6, flex: 1 }}>
          {description}
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {tech.map((t) => (
            <Box
              key={t}
              sx={{
                boxShadow: sunken,
                backgroundColor: w95.lightest,
                fontSize: 11,
                padding: "3px 8px",
              }}
            >
              {t}
            </Box>
          ))}
        </Box>

        <Button
          component="a"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ fontSize: 13, alignSelf: "flex-start" }}
        >
          Apri su GitHub
        </Button>
      </Box>
    </Box>
  );
}

export default function Progetti() {
  return (
    <Box sx={{ padding: { xs: "12px", sm: "32px" } }}>
      <Window title="Progetti" sx={{ maxWidth: 1100, mx: "auto" }}>
        <Box sx={{ padding: { xs: "4px", sm: "16px" } }}>
          <Box
            sx={{
              textAlign: "center",
              fontSize: { xs: "clamp(26px, 8vw, 33px)", sm: 77 },
              fontWeight: "bold",
              marginBottom: "24px",
            }}
          >
            Progetti
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: "20px",
              marginBottom: "24px",
            }}
          >
            {projects.map((project) => (
              <ProjectCard key={project.name} {...project} />
            ))}
          </Box>

          <Box
            sx={{
              display: { xs: "flex", sm: "none" },
              justifyContent: "center",
            }}
          >
            <Button
              component={NavLink}
              to="/contatti"
              sx={{ fontSize: 14, padding: "10px 24px" }}
            >
              Vai a Contatti
            </Button>
          </Box>
        </Box>
      </Window>
    </Box>
  );
}