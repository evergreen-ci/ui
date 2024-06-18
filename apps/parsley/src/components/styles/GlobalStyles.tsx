import { Global, css } from "@emotion/react";
import fontStyles from "components/styles/fonts";

const resetStyles = css`
  /* Reset styles */
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
`;

export const globalStyles = css`
  ${resetStyles}
  background-color: white;
  body {
    font-family: "Euclid Circular A", "Helvetica Neue", Helvetica, Arial,
      sans-serif;
    font-size: 13px;
    margin: 0;
    tab-size: 4;

    /* Prevent scroll bounce behavior */
    overscroll-behavior-y: none;
    overscroll-behavior-x: none;

    /* Hides scroll bar on webkit browsers preventing it from using up page width */
    ::-webkit-scrollbar {
      display: none;
    }
  }
`;

const GlobalStyles = () => (
  <Global
    styles={css`
      ${fontStyles}
      ${globalStyles}
    `}
  />
);

export default GlobalStyles;
