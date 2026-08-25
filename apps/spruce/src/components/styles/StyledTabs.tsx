import { Tabs, TabsProps } from "@leafygreen-ui/tabs";
import { cx } from "@evg-ui/lib/utils/css";
import styles from "./StyledTabs.module.css";

export const StyledTabs: React.FC<TabsProps> = ({ className, ...rest }) => (
  <Tabs className={cx(styles.tabs, className)} {...rest} />
);
