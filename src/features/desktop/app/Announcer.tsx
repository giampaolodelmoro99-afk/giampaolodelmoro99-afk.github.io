import { useCallback, useState } from "react";
import styles from "../Desktop.module.css";

export function useAnnouncer() {
  const [message, setMessage] = useState({ text: "", count: 0 });
  const announce = useCallback((text: string) => {
    setMessage((current) => ({ text, count: current.count + 1 }));
  }, []);
  const region = (
    <div aria-live="polite" aria-atomic="true" className={styles.visuallyHidden}>
      <span key={message.count}>{message.text}</span>
    </div>
  );
  return { announce, region };
}
