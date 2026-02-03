import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import {
  SideNav as LGSideNav,
  SideNavItem as LGSideNavItem,
  SideNavItemProps as LGSideNavItemProps,
  SideNavGroup as LGSideNavGroup,
} from "@leafygreen-ui/side-nav";
import { Body } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { Icon } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";

const { blue } = palette;

export const SideNav = styled(LGSideNav)`
  flex-shrink: 0;
  flex-grow: 0;
`;

export const SideNavGroup = LGSideNavGroup;

export const SideNavItem = LGSideNavItem;

interface SideNavItemProps extends Omit<LGSideNavItemProps, "as"> {
  to?: string;
  href?: string;
  glyph?: React.ReactNode;
}
export const SideNavItemLink: React.FC<SideNavItemProps> = ({
  children,
  glyph,
  ...props
}) => (
  <StyledSideNavItemLink as={Link} {...props}>
    <StyledBody weight="medium">{children}</StyledBody>
    <Icon glyph="ArrowRight" />
  </StyledSideNavItemLink>
);

const StyledSideNavItemLink = styled(LGSideNavItem)<SideNavItemProps>`
  color: ${blue.base};
`;
const StyledBody = styled(Body)`
  color: ${blue.base};
  margin-right: ${size.xxs};
`;
