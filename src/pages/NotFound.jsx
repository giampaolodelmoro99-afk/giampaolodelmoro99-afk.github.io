import Box from "@mui/material/Box";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = () => navigate("/");
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    }, [navigate]);

  return (
    <Box
      onClick={() => navigate("/")}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#0000aa",
        color: "#ffffff",
        fontFamily: '"Courier New", monospace',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#c0c0c0",
          color: "#0000aa",
          fontWeight: "bold",
          padding: "2px 12px",
          marginBottom: "24px",
          fontSize: { xs: 14, sm: 18 },
        }}
      >
        GIANPAOLO_DEL_MORO.EXE
      </Box>

      <Box
        sx={{
          fontSize: { xs: 13, sm: 16 },
          lineHeight: 1.8,
          maxWidth: 640,
        }}
      >
        Errore irreversibile 404: la pagina richiesta non è stata trovata.
        <br />
        <br />
        * È possibile che la pagina sia stata spostata, eliminata
        <br />
        o non sia mai esistita.
        <br />
        * Premere un tasto qualsiasi per tornare alla Home.
        <br />
        <br />
        Premere un tasto qualsiasi per continuare
        <Box
          component="span"
          sx={{
            display: "inline-block",
            width: "0.6em",
            marginLeft: "4px",
            backgroundColor: "#ffffff",
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
  );
}