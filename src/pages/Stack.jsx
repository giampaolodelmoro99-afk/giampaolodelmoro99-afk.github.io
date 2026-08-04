import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { NavLink } from "react-router";
import Window from "../components/Window";
import {
  w95,
  pageMinHeight,
  windowMaxWidth,
  navButtonStyle,
  progressBarStyle,
  progressFillStyle,
} from "../theme/theme";

const frontendSkills = [
  { name: "HTML", level: "Avanzato", percent: 90 },
  { name: "CSS", level: "Intermedio", percent: 65 },
  { name: "JavaScript", level: "Intermedio", percent: 65 },
  { name: "React", level: "Intermedio", percent: 65 },
];

const backendSkills = [
  { name: "PHP", level: "Intermedio", percent: 65 },
  { name: "SQL", level: "Intermedio", percent: 65 },
  { name: "Node.js", level: "Intermedio", percent: 65 },
  { name: "Laravel", level: "Intermedio", percent: 65 },
];

function SkillBar({ name, level, percent }) {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "6px",
          gap: "8px",
        }}
      >
        <Box sx={{ fontWeight: "bold", fontSize: { xs: 14, sm: 16 } }}>
          {name}
        </Box>
        <Box sx={{ fontSize: { xs: 11, sm: 12 }, color: w95.dark }}>
          {level} · {percent}%
        </Box>
      </Box>
      <Box
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${name}: ${level}, ${percent}%`}
        sx={progressBarStyle}
      >
        <Box sx={{ ...progressFillStyle, width: `${percent}%` }} />
      </Box>
    </Box>
  );
}

function SkillsPanel({ legend, skills }) {
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
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          columnGap: "32px",
          rowGap: "20px",
        }}
      >
        {skills.map((skill) => (
          <SkillBar key={skill.name} {...skill} />
        ))}
      </Box>
    </Box>
  );
}

export default function Stack() {
  const [step, setStep] = useState("frontend");
  const isFrontend = step === "frontend";

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
      <Window
        title={isFrontend ? "Stack - Frontend" : "Stack - Backend"}
        sx={{ width: "100%", maxWidth: windowMaxWidth }}
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
            Stack
          </Box>

          {isFrontend ? (
            <SkillsPanel
              legend="Installazione competenze frontend in corso..."
              skills={frontendSkills}
            />
          ) : (
            <SkillsPanel
              legend="Installazione competenze backend in corso..."
              skills={backendSkills}
            />
          )}

          <Box
            sx={{
              display: "flex",
              gap: { xs: "8px", sm: "12px" },
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {isFrontend ? (
              <>
                <Button
                  component={NavLink}
                  to="/profilo"
                  sx={navButtonStyle}
                >
                  &lt; Torna a Profilo
                </Button>
                <Button onClick={() => setStep("backend")} sx={navButtonStyle}>
                  Vai a Backend &gt;
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setStep("frontend")} sx={navButtonStyle}>
                  &lt; Torna a Frontend
                </Button>
                <Button
                  component={NavLink}
                  to="/progetti"
                  sx={navButtonStyle}
                >
                  Vai a Progetti &gt;
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Window>
    </Box>
  );
}