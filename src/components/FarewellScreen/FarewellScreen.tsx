import { useEffect, useRef } from "react";
import { Button } from "../Button";
import { cx } from "../cx";
import { Icon } from "../Icon";
import styles from "./FarewellScreen.module.css";

export type FarewellScreenProps = {
  heading: string;
  message: string;
  restartLabel: string;
  footer: string;
  onRestart: () => void;
  className?: string | undefined;
};

export function FarewellScreen({
  heading,
  message,
  restartLabel,
  footer,
  onRestart,
  className,
}: FarewellScreenProps) {
  const restart = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    restart.current?.focus();
  }, []);

  return (
    <main className={cx(styles.root, className)}>
      <div className={styles.content}>
        <Icon name="gdm" size={32} scale={2} />
        <h1 className={styles.heading}>{heading}</h1>
        <p className={styles.message}>{message}</p>
        <Button ref={restart} variant="default" onPress={onRestart} className={cx(styles.restart)}>
          {restartLabel}
        </Button>
      </div>
      <p className={styles.footer}>{footer}</p>
    </main>
  );
}
