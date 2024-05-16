import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Link as LGLink } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";

// @ts-ignore: FIXME. This comment was added by an automated script.
export const StyledLink = (props) => (
  <LGLink
    hideExternalIcon
    css={css`
      // Override LeafyGreen's font-weight declaration for Link
      font-weight: inherit;
      font-size: inherit;
      line-height: inherit;
    `}
    {...props}
  />
);

// @ts-ignore: FIXME. This comment was added by an automated script.
export const StyledRouterLink = (props) => <StyledLink as={Link} {...props} />;

export const ShortenedRouterLink = styled(StyledRouterLink)<{
  width?: number;
}>`
  span {
    display: inline-block;
    vertical-align: bottom;
    max-width: ${({ width }) => `${width ?? 200}px`};
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
