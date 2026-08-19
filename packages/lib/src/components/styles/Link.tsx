import { forwardRef } from "react";
import { Link, LinkProps } from "@leafygreen-ui/typography";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";
import { cx } from "../../utils/css";
import styles from "./Link.module.css";

const StyledLink = ({ className, ...props }: LinkProps<"a">) => (
  <Link className={cx(styles.link, className)} hideExternalIcon {...props} />
);

const StyledRouterLink = forwardRef<
  HTMLSpanElement,
  LinkProps<"span"> & RouterLinkProps
>(({ className, ...props }, ref) => (
  <Link
    // @ts-expect-error: An internal LeafyGreen type causes this error.
    ref={ref}
    // @ts-expect-error: An internal LeafyGreen type causes this error.
    as={RouterLink}
    className={cx(styles.link, className)}
    {...props}
  />
));

StyledRouterLink.displayName = "StyledRouterLink";

export { StyledLink, StyledRouterLink };
