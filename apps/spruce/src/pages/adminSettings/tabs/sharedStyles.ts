import { css } from "@emotion/react";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants/tokens";

export const radioCSS = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: ${size.xs};
  margin-bottom: 0px;
  max-width: 100%;
`;

export const fullWidthCss = css`
  grid-column: span 2;
`;

export const gridWrapCss = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: ${size.m};
`;

export const objectGridCss = css`
  > div {
    ${gridWrapCss};
  }
`;

export const nestedObjectGridCss = css`
  ${fullWidthCss};
  > fieldset {
    ${gridWrapCss};
    // Makes title span all columns.
    > div:first-of-type {
      ${fullWidthCss};
    }
    // Makes description span all columns.
    > p:first-of-type {
      ${fullWidthCss};
    }
  }
`;

const { gray } = palette;

export const arrayItemCSS = css`
  border: 1px solid ${gray.light2};
  border-radius: ${size.m};
  padding: ${size.m};
  margin-bottom: ${size.s};

  > div > fieldset {
    ${gridWrapCss};
  }
`;
