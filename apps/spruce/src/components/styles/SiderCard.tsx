import { forwardRef } from "react";
import { Card, CardProps } from "@leafygreen-ui/card";
import { cx } from "@evg-ui/lib/utils/css";
import styles from "./SiderCard.module.css";

export const SiderCard = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...rest }, ref) => (
    <Card ref={ref} className={cx(styles.siderCard, className)} {...rest} />
  ),
);
SiderCard.displayName = "SiderCard";
