import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { NavLink } from "react-router";
import Window from "../components/Window";
import { w95, sunken } from "../theme/theme";

const skills = [
  { name: "HTML", level: "Avanzato", percent: 90 },
  { name: "CSS", level: "Intermedio", percent: 65 },
  { name: "JavaScript", level: "Intermedio", percent: 65 },
  { name: "React", level: "Intermedio", percent: 65 },
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
        <Box sx={{ fontSize: { xs: 11, sm: 12 }, color: "#333" }}>
          {level} · {percent}%
        </Box>
      </Box>
      <Box
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${name}: ${level}, ${percent}%`}
        sx={{
          height: 20,
          boxShadow: sunken,
          backgroundColor: w95.lightest,
          padding: "3px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: `${percent}%`,
            backgroundImage: `repeating-linear-gradient(90deg, ${w95.navy} 0 10px, transparent 10px 13px)`,
          }}
        />
      </Box>
    </Box>
  );
}

export default function Stack() {
  return (
    <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: {xs: "calc(100vh - 80px)"},
      padding: { xs: "12px", sm: "32px" } }}>
      <Window title="Stack" sx={{ width: "100%", maxWidth: 1000 }}>
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
              Installazione competenze in corso...
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

          <Box
            sx={{
              display: { xs: "flex", sm: "none" },
              justifyContent: "center",
            }}
          >
            <Button
              component={NavLink}
              to="/progetti"
              sx={{ fontSize: 14, padding: "10px 24px" }}
            >
              Vai a Progetti
            </Button>
          </Box>
        </Box>
      </Window>
    </Box>
  );
}