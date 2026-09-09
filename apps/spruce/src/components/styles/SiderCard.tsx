import { forwardRef } from "react";
import { Card, CardProps } from "@via-ds/components/card";
import { cx } from "@evg-ui/lib/utils/css";
import styles from "./SiderCard.module.css";

export const SiderCard = forwardRef<HTMLElement, CardProps>(
  ({ className, density = "compact", ...rest }, ref) => (
    <Card
      ref={ref}
      className={cx(styles.siderCard, className)}
      density={density}
      {...rest}
    />
  ),
);
SiderCard.displayName = "SiderCard";
