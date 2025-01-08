import { Global, css } from "@emotion/react";
import { fontFamilies } from "@leafygreen-ui/tokens";
import { fontStyles } from "./fonts";

export const resetStyles = css`
  /* Reset styles, usage recommended by LeafyGreen. */
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
`;

const spruceResetStyles = css`
  ${resetStyles}

  /* Hide underlines on links. */
  a {
    text-decoration: none;
  }

  /* Hide outlines on pages that use RJSF forms. */
  fieldset {
    border: 0;
    margin: 0;
    padding: 0;
  }
`;

const parsleyResetStyles = css`
  ${resetStyles}
`;

export const spruceGlobalStyles = css`
  ${spruceResetStyles}
  ${fontStyles}
  background-color: white;

  /* Used for styling task logs. */
  pre {
    font-family: ${fontFamilies.code};
    line-height: 1.5;
    margin: 0;
  }

  body {
    font-family: ${fontFamilies.default};
    font-size: 13px;
    margin: 0;

    /* Added in EVG-18710 to address complaints about newer MongoDB fonts. */
    -webkit-font-smoothing: antialiased; // Chrome, Safari
    -moz-osx-font-smoothing: grayscale; // Firefox
  }
`;

export const parsleyGlobalStyles = css`
  ${fontStyles}
  ${parsleyResetStyles}
  background-color: white;

  body {
    font-family: ${fontFamilies.default};
    font-size: 13px;
    margin: 0;

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

export const SpruceGlobalStyles = () => <Global styles={spruceGlobalStyles} />;

export const ParsleyGlobalStyles = () => (
  <Global styles={parsleyGlobalStyles} />
);
