import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import {
  SideNav as LGSideNav,
  SideNavGroup as LGSideNavGroup,
  SideNavItem as LGSideNavItem,
  SideNavItemProps as LGSideNavItemProps,
} from "@leafygreen-ui/side-nav";
import { Body } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";

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

const StyledSideNavItemLink = styled(LGSideNavItem)`
  color: ${blue.base};
`;
const StyledBody = styled(Body)`
  color: ${blue.base};
  margin-right: ${size.xxs};
`;
