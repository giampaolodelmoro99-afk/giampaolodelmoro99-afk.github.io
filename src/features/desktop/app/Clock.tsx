import { useEffect, useState } from "react";
import { useLocale, useT } from "../../../i18n";
import { intlLocales } from "../../../routes/routeMap";
import styles from "../Desktop.module.css";

export function Clock({ className }: { className?: string | undefined }) {
  const t = useT();
  const locale = useLocale();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    const delay = 60_000 - (Date.now() % 60_000);
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      tick();
      interval = setInterval(tick, 60_000);
    }, delay);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  const time = new Intl.DateTimeFormat(intlLocales[locale], {
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);

  return (
    <span className={className}>
      <span className={styles.visuallyHidden}>{t.desktop.clockLabel} </span>
      <time dateTime={now.toISOString()}>{time}</time>
    </span>
  );
}
