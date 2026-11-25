import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@via-ds/components/tabs";
import styles from "./StyledTabs.module.css";

export interface StyledTab {
  key: string;
  name: React.ReactNode;
  content: React.ReactNode;
}

interface StyledTabsProps {
  "aria-label": string;
  onValueChange: (index: number) => void;
  tabs: StyledTab[];
  value: number;
}

export const StyledTabs: React.FC<StyledTabsProps> = ({
  "aria-label": ariaLabel,
  onValueChange,
  tabs,
  value,
}) => (
  <Tabs
    onSelectionChange={(key) =>
      onValueChange(tabs.findIndex((tab) => tab.key === key))
    }
    selectedKey={tabs[value]?.key}
  >
    <TabList aria-label={ariaLabel}>
      {tabs.map(({ key, name }) => (
        <Tab key={key}>{name}</Tab>
      ))}
    </TabList>
    <TabPanels className={styles.panels}>
      {tabs.map(({ content, key }) => (
        <TabPanel key={key}>{content}</TabPanel>
      ))}
    </TabPanels>
  </Tabs>
);
