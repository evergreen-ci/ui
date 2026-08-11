import { Global, css } from "@emotion/react";
import { fontFamilies } from "@leafygreen-ui/tokens";
import {
  bodyStyles,
  fontStyles,
  resetStyles as sharedResetStyles,
} from "@evg-ui/lib/components/styles";

const resetStyles = css`
  ${sharedResetStyles}

  /* Hide underlines on links. */
  a {
    text-decoration: none;
  }

  /* Hide outlines on RJSF forms. */
  fieldset {
    border: 0;
    margin: 0;
    padding: 0;
  }
`;

export const globalStyles = css`
  ${resetStyles}
  ${fontStyles}
  background-color: white;

  /* Via's stylesheet sets "color-scheme: light dark" on :root, which makes the
     browser paint canvas, scrollbars, and form controls per the OS preference.
     Spruce is light-only. */
  :root {
    color-scheme: light;
  }

  /* Used for styling task logs. */
  pre {
    font-family: ${fontFamilies.code};
    line-height: 1.5;
    margin: 0;
  }

  /* Used for styling InlineCode and Code. */
  code {
    line-height: inherit !important;
  }

  body {
    ${bodyStyles}

    /* Added in EVG-18710 to address complaints about newer MongoDB fonts. */
    -webkit-font-smoothing: antialiased; // Chrome, Safari
    -moz-osx-font-smoothing: grayscale; // Firefox
  }
`;

export const GlobalStyles = () => <Global styles={globalStyles} />;
