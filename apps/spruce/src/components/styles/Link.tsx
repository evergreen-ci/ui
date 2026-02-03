import styled from "@emotion/styled";
import { StyledRouterLink } from "@evg-ui/lib/components";

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
export const ShortenedRouterLink = styled(
  StyledRouterLink,
)<ShortenedRouterLinkProps>`
  span {
    display: inline-block;
    vertical-align: bottom;
    ${({ baseWidth, responsiveBreakpoint }) =>
      responsiveBreakpoint
        ? `@media (max-width: ${responsiveBreakpoint}px) { max-width: ${baseWidth}px; }`
        : null};
    max-width: ${({ baseWidth, responsiveBreakpoint }) =>
      responsiveBreakpoint
        ? `calc(100vw - ${responsiveBreakpoint - (baseWidth ?? 200)}px)`
        : `${baseWidth ?? 200}px`};
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
