import { cx } from "@evg-ui/lib/utils/css";
import styles from "./sharedStyles.module.css";

interface StickyHeaderContainerProps {
  children: React.ReactNode;
  className?: string;
  saveable: boolean;
  showShadow: boolean;
}

export const StickyHeaderContainer: React.FC<StickyHeaderContainerProps> = ({
  children,
  className,
  saveable,
  showShadow,
}) => (
  <div
    className={cx(
      styles.stickyHeaderContainer,
      saveable && styles.saveable,
      showShadow ? styles.shadow : styles.noShadow,
      className,
    )}
  >
    {children}
  </div>
);
