import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { NavLink } from "react-router";
import Window from "../components/Window";
import { w95, raised, sunken } from "../theme/theme";

const navButtonStyle = {
  fontSize: { xs: 12, sm: 14 },
  padding: { xs: "10px 8px", sm: "10px 24px" },
  flex: { xs: "1 1 0", sm: "0 0 auto" },
  whiteSpace: "nowrap",
};

const nodeProjects = [
  {
    name: "task-manager.exe",
    description:
      "API RESTful per gestire task, note e utenti, con autenticazione JWT, OpenWeather e assistente IA basato su Google Gemini.",
    tech: ["Node.js", "Express", "MariaDB", "JWT", "Gemini AI"],
    url: "https://github.com/giampaolodelmoro99-afk/task-manager-node",
  },
  {
    name: "rubrica.exe",
    description:
      "API per una rubrica telefonica protetta: autenticazione JWT, isolamento dei dati tra utenti, integrità referenziale con ON DELETE CASCADE.",
    tech: ["Node.js", "Express", "MariaDB", "JWT"],
    url: "https://github.com/giampaolodelmoro99-afk/progetto-node-rubrica",
  },
  {
    name: "gestione-spese.exe",
    description:
      "Expense tracker con categorie personalizzate di entrate e uscite, calcolo del bilancio ed eliminazione a cascata per mantenere il database pulito.",
    tech: ["Node.js", "Express", "MariaDB", "JWT"],
    url: "https://github.com/giampaolodelmoro99-afk/gestione-spese-node",
  },
];

const laravelProjects = [
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
    name: "task-notes.exe",
    description:
      "Sistema full stack di gestione attività e note: API RESTful in Laravel con autenticazione Sanctum e frontend in JavaScript vanilla.",
    tech: ["Laravel", "Sanctum", "JavaScript", "MySQL", "Docker"],
    url: "https://github.com/giampaolodelmoro99-afk/laravel-task-manager",
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

function ProjectsPanel({ legend, projects }) {
  return (
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
        {legend}
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: "20px",
        }}
      >
        {projects.map((project) => (
          <ProjectCard key={project.name} {...project} />
        ))}
      </Box>
    </Box>
  );
}

export default function Progetti() {
  const [step, setStep] = useState("node");
  const isNode = step === "node";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  return (
    <Box sx={{ padding: { xs: "12px", sm: "32px" } }}>
      <Window
        title={isNode ? "Progetti - Node.js" : "Progetti - Laravel"}
        sx={{ maxWidth: 1100, mx: "auto" }}
      >
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

          {isNode ? (
            <ProjectsPanel legend="Progetti Node.js" projects={nodeProjects} />
          ) : (
            <ProjectsPanel
              legend="Progetti Laravel"
              projects={laravelProjects}
            />
          )}

          <Box
            sx={{
              display: "flex",
              gap: { xs: "8px", sm: "12px" },
              justifyContent: "center",
            }}
          >
            {isNode ? (
              <>
                <Button component={NavLink} to="/stack" sx={navButtonStyle}>
                  &lt; Torna a Stack
                </Button>
                <Button onClick={() => setStep("laravel")} sx={navButtonStyle}>
                  Progetti Laravel &gt;
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setStep("node")} sx={navButtonStyle}>
                  &lt; Progetti Node.js
                </Button>
                <Button component={NavLink} to="/contatti" sx={navButtonStyle}>
                  Vai a Contatti &gt;
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Window>
    </Box>
  );
}