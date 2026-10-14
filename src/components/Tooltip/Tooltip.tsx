import type { ReactElement } from "react";
import {
  Tooltip as AriaTooltip,
  type TooltipProps as AriaTooltipProps,
  TooltipTrigger,
  type TooltipTriggerComponentProps,
} from "react-aria-components/Tooltip";
import { cx } from "../cx";
import styles from "./Tooltip.module.css";

export const tooltipDelay = 600;

export type TooltipProps = Omit<TooltipTriggerComponentProps, "children"> & {
  text: string;
  children: ReactElement;
  placement?: AriaTooltipProps["placement"];
  className?: string;
};

export function Tooltip({
  text,
  children,
  placement = "bottom",
  delay = tooltipDelay,
  className,
  ...props
}: TooltipProps) {
  return (
    <TooltipTrigger {...props} delay={delay}>
      {children}
      <AriaTooltip placement={placement} offset={4} className={cx(styles.root, className)}>
        {text}
      </AriaTooltip>
    </TooltipTrigger>
  );
}
