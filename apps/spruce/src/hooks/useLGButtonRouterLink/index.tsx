import { memo } from "react";
import { Link, LinkProps } from "react-router-dom";

export const useLGButtonRouterLink = (to: string) => {
  const RouterLink = memo(({ children, ...rest }: LinkProps) => (
    <Link {...rest} to={to}>
      {children}
    </Link>
  ));
  RouterLink.displayName = "LGButtonRouterLink";
  return RouterLink;
};
