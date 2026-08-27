import { ComponentPropsWithoutRef, forwardRef } from "react";
import { Body, BodyProps, H2, H2Props } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import { cx } from "@evg-ui/lib/utils/css";
import styles from "./Layout.module.css";

export const navBarHeight = size.xl;

export const SiteLayout = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, ...rest }, ref) => (
  <div ref={ref} className={cx(styles.siteLayout, className)} {...rest} />
));
SiteLayout.displayName = "SiteLayout";

export const SideNavPageWrapper = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, ...rest }, ref) => (
  <div
    ref={ref}
    className={cx(styles.sideNavPageWrapper, className)}
    {...rest}
  />
));
SideNavPageWrapper.displayName = "SideNavPageWrapper";

export const SideNavPageContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, ...rest }, ref) => (
  <div
    ref={ref}
    className={cx(styles.sideNavPageContent, className)}
    {...rest}
  />
));
SideNavPageContent.displayName = "SideNavPageContent";

// Override default margins to support sticky headers on Project/Distro/Admin Settings pages.
export const SettingsPageContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, ...rest }, ref) => (
  <div
    ref={ref}
    className={cx(
      styles.sideNavPageContent,
      styles.settingsPageContent,
      className,
    )}
    {...rest}
  />
));
SettingsPageContent.displayName = "SettingsPageContent";

interface PageWrapperProps extends ComponentPropsWithoutRef<"div"> {
  omitPadding?: boolean;
}

export const PageWrapper = forwardRef<HTMLDivElement, PageWrapperProps>(
  ({ className, omitPadding, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx(
        styles.pageWrapper,
        omitPadding && styles.omitPadding,
        className,
      )}
      {...rest}
    />
  ),
);
PageWrapper.displayName = "PageWrapper";

interface PageLayoutProps extends ComponentPropsWithoutRef<"section"> {
  hasSider?: boolean;
}

export const PageLayout = forwardRef<HTMLElement, PageLayoutProps>(
  ({ className, hasSider, ...rest }, ref) => (
    <section
      ref={ref}
      className={cx(styles.pageLayout, hasSider && styles.hasSider, className)}
      {...rest}
    />
  ),
);
PageLayout.displayName = "PageLayout";

export const siderCardWidth = 275;

interface PageSiderProps extends ComponentPropsWithoutRef<"aside"> {
  width?: number;
}

export const PageSider = forwardRef<HTMLElement, PageSiderProps>(
  ({ className, style, width, ...rest }, ref) => (
    <aside
      ref={ref}
      className={cx(styles.pageSider, className)}
      style={
        width !== undefined
          ? { maxWidth: width, minWidth: width, width, ...style }
          : style
      }
      {...rest}
    />
  ),
);
PageSider.displayName = "PageSider";

export const PageContent = forwardRef<
  HTMLElement,
  ComponentPropsWithoutRef<"main">
>(({ className, ...rest }, ref) => (
  <main ref={ref} className={cx(styles.pageContent, className)} {...rest} />
));
PageContent.displayName = "PageContent";

export const PageTitle = forwardRef<HTMLHeadingElement, H2Props>(
  ({ className, ...rest }, ref) => (
    <H2 ref={ref} className={cx(styles.pageTitle, className)} {...rest} />
  ),
);
PageTitle.displayName = "PageTitle";

export const PageButtonRow = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, ...rest }, ref) => (
  <div ref={ref} className={cx(styles.pageButtonRow, className)} {...rest} />
));
PageButtonRow.displayName = "PageButtonRow";

export const InputLabel = forwardRef<
  HTMLLabelElement,
  ComponentPropsWithoutRef<"label">
>(({ className, ...rest }, ref) => (
  // eslint-disable-next-line jsx-a11y/label-has-associated-control -- pre-existing violation, surfaced by the Emotion conversion
  <label ref={ref} className={cx(styles.inputLabel, className)} {...rest} />
));
InputLabel.displayName = "InputLabel";

export const ErrorMessage = forwardRef<HTMLElement, BodyProps>(
  ({ className, ...rest }, ref) => (
    <Body ref={ref} className={cx(styles.errorMessage, className)} {...rest} />
  ),
);
ErrorMessage.displayName = "ErrorMessage";
