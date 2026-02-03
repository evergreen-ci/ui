import { Global, css } from "@emotion/react";
import { bodyStyles, fontStyles, resetStyles } from "@evg-ui/lib/components";

export const globalStyles = css`
  ${fontStyles}
  ${resetStyles}
  background-color: white;

  body {
    ${bodyStyles}

    /* Increase default tab size to make it easier to read logs. */
    tab-size: 4;

    /* Prevent scroll bounce behavior. */
    overscroll-behavior-y: none;
    overscroll-behavior-x: none;

    /* Hide scroll bar on webkit browsers to prevent it from using up page width. */
    ::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const GlobalStyles = () => <Global styles={globalStyles} />;
