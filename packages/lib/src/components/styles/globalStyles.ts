import { css } from "@emotion/react";
import { fontFamilies, BaseFontSize } from "@leafygreen-ui/tokens";

export const resetStyles = css`
  /* Reset styles, usage recommended by LeafyGreen. */
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  /* 
  * Hide scroll bar on webkit browsers to prevent it from using up page width. 
  * The reason to do this is largely because of the Cypress tests running in a Linux environment,
  * in which scrollbars behave differently from Mac environments.
  */
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const bodyStyles = css`
  font-family: ${fontFamilies.default};
  font-size: ${BaseFontSize.Body1}px;
  margin: 0;
`;
