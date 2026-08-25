import { forwardRef } from "react";
import { LinkProps } from "@leafygreen-ui/typography";
import { LinkProps as RouterLinkProps } from "react-router-dom";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { cx } from "@evg-ui/lib/utils/css";
import styles from "./Link.module.css";

interface ShortenedRouterLinkProps {
  baseWidth?: number;
  responsiveBreakpoint?: number;
}
/**
 * ShortenedRouterLink is a styled component that truncates the text of a link and adds an ellipsis if it overflows.
 * @param props The props for the ShortenedRouterLink component.
 * @param props.baseWidth The base width of the link.
 * @param props.responsiveBreakpoint The breakpoint at which the link should set it's width based on screen width.
 * @returns A styled link that truncates the text and adds an ellipsis if it overflows.
 */
export const ShortenedRouterLink = forwardRef<
  HTMLSpanElement,
  ShortenedRouterLinkProps & LinkProps<"span"> & RouterLinkProps
>(({ baseWidth, className, responsiveBreakpoint, style, ...rest }, ref) => {
  // max() reproduces the old media query when baseWidth is set: the two
  // expressions are equal at exactly the breakpoint, so clamping is
  // identical to switching rules. Without baseWidth the old media rule
  // emitted an invalid max-width, so only the bare calc applied.
  let maxWidth = `${baseWidth ?? 200}px`;
  if (responsiveBreakpoint) {
    maxWidth =
      baseWidth !== undefined
        ? `max(${baseWidth}px, calc(100vw - ${responsiveBreakpoint - baseWidth}px))`
        : `calc(100vw - ${responsiveBreakpoint - 200}px)`;
  }
  return (
    <StyledRouterLink
      ref={ref}
      className={cx(styles.shortened, className)}
      style={
        {
          "--shortened-max-width": maxWidth,
          ...style,
        } as React.CSSProperties
      }
      {...rest}
    />
  );
});
ShortenedRouterLink.displayName = "ShortenedRouterLink";
