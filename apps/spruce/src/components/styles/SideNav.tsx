import { forwardRef } from "react";
import {
  SideNav as LGSideNav,
  SideNavGroup,
  SideNavItem,
  SideNavProps,
} from "@leafygreen-ui/side-nav";
import { Body } from "@leafygreen-ui/typography";
import ArrowRight from "@via-ds/icons/ArrowRight";
import { Link } from "react-router-dom";
import { cx } from "@evg-ui/lib/utils/css";
import styles from "./SideNav.module.css";

const SideNav = forwardRef<HTMLDivElement, SideNavProps>(
  ({ className, ...rest }, ref) => (
    <LGSideNav ref={ref} className={cx(styles.sideNav, className)} {...rest} />
  ),
);
SideNav.displayName = "SideNav";

interface SideNavItemLinkProps {
  children?: React.ReactNode;
  className?: string;
  glyph?: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  to: string;
  [dataAttr: `data-${string}`]: string | undefined;
}
export const SideNavItemLink: React.FC<SideNavItemLinkProps> = ({
  children,
  className,
  glyph,
  ...props
}) => (
  <SideNavItem
    as={Link}
    className={cx(styles.sideNavItemLink, className)}
    {...props}
  >
    <Body className={styles.body} weight="medium">
      {children}
    </Body>
    <ArrowRight />
  </SideNavItem>
);

export { SideNav, SideNavGroup, SideNavItem };
