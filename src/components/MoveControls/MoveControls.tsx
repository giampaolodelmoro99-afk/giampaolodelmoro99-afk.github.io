import { Group } from "react-aria-components/Group";
import { Button } from "../Button";
import { cx } from "../cx";
import { Glyph } from "../Icon";
import { useUiStrings } from "../useUiStrings";
import styles from "./MoveControls.module.css";

export type MoveDirection = "up" | "down" | "left" | "right";

export type MoveControlsProps = {
  onStep: (direction: MoveDirection) => void;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string | undefined;
};

const directions: readonly MoveDirection[] = ["up", "left", "right", "down"];

export function MoveControls({ onStep, onConfirm, onCancel, className }: MoveControlsProps) {
  const strings = useUiStrings().moveControls;
  return (
    <Group aria-label={strings.label} className={cx(styles.root, className)}>
      <div className={styles.arrows}>
        {directions.map((direction) => (
          <Button
            key={direction}
            aria-label={strings[direction]}
            className={cx(styles.arrow)}
            data-direction={direction}
            onPress={() => onStep(direction)}
          >
            <Glyph name={direction} />
          </Button>
        ))}
      </div>
      <div className={styles.actions}>
        <Button variant="default" className={cx(styles.action)} onPress={onConfirm}>
          {strings.confirm}
        </Button>
        <Button className={cx(styles.action)} onPress={onCancel}>
          {strings.cancel}
        </Button>
      </div>
    </Group>
  );
}
