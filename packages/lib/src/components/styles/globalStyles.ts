import { css } from "@emotion/react";
import { fontFamilies } from "@leafygreen-ui/tokens";

export const resetStyles = css`
  /* Reset styles, usage recommended by LeafyGreen. */
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
`;

export const bodyStyles = css`
  font-family: ${fontFamilies.default};
  font-size: 13px;
  margin: 0;
`;
