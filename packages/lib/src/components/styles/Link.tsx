import { forwardRef } from "react";
import { css } from "@emotion/react";
import { Link, LinkProps } from "@leafygreen-ui/typography";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";

// Override LeafyGreen's font-weight declaration for Link.
const overrideStyles = css`
  font-weight: inherit;
  font-size: inherit;
  line-height: inherit;
`;

const StyledLink = (props: LinkProps<"a">) => (
  // @ts-ignore-error: An internal LeafyGreen type causes this error.
  <Link css={overrideStyles} hideExternalIcon {...props} />
);

const StyledRouterLink = forwardRef<
  HTMLSpanElement,
  LinkProps<"span"> & RouterLinkProps
>((props, ref) => (
  // @ts-ignore-error: An internal LeafyGreen type causes this error.
  <Link ref={ref} as={RouterLink} css={overrideStyles} {...props} />
));

export { StyledLink, StyledRouterLink };
