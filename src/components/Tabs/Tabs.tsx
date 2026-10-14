import type { Key, ReactNode } from "react";
import {
  Tabs as AriaTabs,
  type TabsProps as AriaTabsProps,
  Tab,
  TabList,
  TabPanel,
} from "react-aria-components/Tabs";
import { cx } from "../cx";
import styles from "./Tabs.module.css";

export type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
  isDisabled?: boolean;
};

export type TabsProps = Omit<
  AriaTabsProps,
  "children" | "className" | "style" | "onSelectionChange"
> & {
  label: string;
  tabs: TabItem[];
  onSelectionChange?: (key: Key) => void;
  className?: string | undefined;
};

export function Tabs({ label, tabs, className, ...props }: TabsProps) {
  const disabledKeys = tabs.filter((tab) => tab.isDisabled).map((tab) => tab.id);
  return (
    <AriaTabs {...props} disabledKeys={disabledKeys} className={cx(styles.root, className)}>
      <TabList aria-label={label} className={cx(styles.tablist)}>
        {tabs.map((tab) => (
          <Tab key={tab.id} id={tab.id} className={cx(styles.tab)}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
      {tabs.map((tab) => (
        <TabPanel key={tab.id} id={tab.id} className={cx(styles.panel)}>
          {tab.content}
        </TabPanel>
      ))}
    </AriaTabs>
  );
}
