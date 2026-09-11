import { ComponentProps, forwardRef } from "react";
import { Card, CardProps } from "@via-ds/components/card";
import { H3 } from "@via-ds/components/typography";
import { cx } from "@evg-ui/lib/utils/css";
import styles from "./SettingsCard.module.css";

export const SettingsCardTitle = forwardRef<HTMLHeadingElement, ComponentProps<typeof H3>>(
  ({ className, ...rest }, ref) => (
    <H3
      ref={ref}
      className={cx(styles.settingsCardTitle, className)}
      {...rest}
    />
  ),
);
SettingsCardTitle.displayName = "SettingsCardTitle";

export const formComponentSpacingCSS = "margin-bottom: 48px;";

export const SettingsCard = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...rest }, ref) => (
    <Card ref={ref} className={cx(styles.settingsCard, className)} {...rest} />
  ),
);
SettingsCard.displayName = "SettingsCard";
