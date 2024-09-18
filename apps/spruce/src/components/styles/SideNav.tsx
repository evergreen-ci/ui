import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import {
  SideNav as LGSideNav,
  SideNavItem as LGSideNavItem,
  SideNavGroup as LGSideNavGroup,
} from "@leafygreen-ui/side-nav";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import Icon from "components/Icon";
import { zIndex, size } from "constants/tokens";

const { blue } = palette;

export const SideNav = styled(LGSideNav)`
  flex-shrink: 0;
  flex-grow: 0;
  z-index: ${zIndex.sideNav};
`;

export const SideNavGroup = LGSideNavGroup;

export const SideNavItem = LGSideNavItem;

interface SideNavItemProps
  extends Omit<React.ComponentProps<typeof LGSideNavItem>, "as"> {
  to?: string;
  href?: string;
  glyph?: React.ReactNode;
}
export const SideNavItemLink: React.FC<SideNavItemProps> = ({
  children,
  glyph,
  ...props
}) => (
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  <StyledSideNavItemLink as={Link} {...props}>
    <StyledBody weight="medium">{children}</StyledBody>
    <Icon glyph="ArrowRight" />
  </StyledSideNavItemLink>
);

// @ts-expect-error
const StyledSideNavItemLink = styled(LGSideNavItem)<SideNavItemProps>`
  color: ${blue.base};
`;
const StyledBody = styled(Body)<BodyProps>`
  color: ${blue.base};
  margin-right: ${size.xxs};
`;
