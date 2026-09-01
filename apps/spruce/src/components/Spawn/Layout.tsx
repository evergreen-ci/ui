import { ComponentPropsWithoutRef, forwardRef } from "react";
import { H2 } from "@leafygreen-ui/typography";
import { cx } from "@evg-ui/lib/utils/css";
import styles from "./Layout.module.css";

export const Title = H2;

export const TitleContainer = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, ...rest }, ref) => (
  <div ref={ref} className={cx(styles.titleContainer, className)} {...rest} />
));
TitleContainer.displayName = "TitleContainer";

export const BadgeWrapper = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, ...rest }, ref) => (
  <div ref={ref} className={cx(styles.badgeWrapper, className)} {...rest} />
));
BadgeWrapper.displayName = "BadgeWrapper";

export const DoesNotExpire = "Does not expire";

export const ModalContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, ...rest }, ref) => (
  <div ref={ref} className={cx(styles.modalContent, className)} {...rest} />
));
ModalContent.displayName = "ModalContent";

export const Section = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, ...rest }, ref) => (
  <div
    ref={ref}
    className={cx(styles.modalContent, styles.section, className)}
    {...rest}
  />
));
Section.displayName = "Section";
