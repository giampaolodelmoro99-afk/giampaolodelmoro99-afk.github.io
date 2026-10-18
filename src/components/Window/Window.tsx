import { type ReactNode, useId } from "react";
import { Button } from "react-aria-components/Button";
import { cx } from "../cx";
import { Glyph, Icon, type SmallIconName } from "../Icon";
import { useUiStrings } from "../useUiStrings";
import styles from "./Window.module.css";

export type WindowControl = "minimize" | "maximize" | "close";

export type WindowProps = {
  title: string;
  icon?: SmallIconName;
  isActive?: boolean;
  isMaximized?: boolean;
  variant?: "app" | "document";
  controls?: WindowControl[];
  onMinimize?: () => void;
  onToggleMaximize?: () => void;
  onClose?: () => void;
  menu?: ReactNode;
  statusBar?: ReactNode;
  children: ReactNode;
  titleId?: string;
  isLandmark?: boolean;
  className?: string | undefined;
};

const allControls: WindowControl[] = ["minimize", "maximize", "close"];

export function Window({
  title,
  icon,
  isActive = true,
  isMaximized = false,
  variant = "app",
  controls = allControls,
  onMinimize,
  onToggleMaximize,
  onClose,
  menu,
  statusBar,
  children,
  titleId: titleIdProp,
  isLandmark = true,
  className,
}: WindowProps) {
  const generatedId = useId();
  const titleId = titleIdProp ?? generatedId;
  const Frame = isLandmark ? "section" : "div";
  const TitleBar = isLandmark ? "header" : "div";
  const strings = useUiStrings().window;
  const actions = {
    minimize: { label: strings.minimize, glyph: "minimize", onPress: onMinimize },
    maximize: {
      label: isMaximized ? strings.restore : strings.maximize,
      glyph: isMaximized ? "restore" : "maximize",
      onPress: onToggleMaximize,
    },
    close: { label: strings.close, glyph: "close", onPress: onClose },
  } as const;

  return (
    <Frame
      aria-labelledby={isLandmark ? titleId : undefined}
      className={cx(styles.root, className)}
      data-active={isActive}
      data-maximized={isMaximized || undefined}
      data-variant={variant}
    >
      <TitleBar className={styles.titlebar}>
        {icon && <Icon name={icon} size={16} className={cx(styles.titleIcon)} />}
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <span className={styles.controls}>
          {allControls
            .filter((control) => controls.includes(control))
            .map((control) => {
              const { label, glyph, onPress } = actions[control];
              return (
                <Button
                  key={control}
                  aria-label={label}
                  className={cx(styles.control, control === "close" && styles.close)}
                  {...(onPress ? { onPress } : {})}
                >
                  <Glyph name={glyph} />
                </Button>
              );
            })}
        </span>
      </TitleBar>
      {menu}
      <div className={variant === "document" ? cx(styles.body, styles.document) : styles.body}>
        {children}
      </div>
      {statusBar}
    </Frame>
  );
}
