import { css } from "@emotion/react";
import { size } from "@evg-ui/lib/constants/tokens";

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

export const fullWidthCss = css`
  grid-column: span 2;
`;

export const nestedObjectGridCss = css`
  ${fullWidthCss};
  > fieldset {
    ${gridWrapCss};
    > div:first-of-type {
      ${fullWidthCss};
    }
  }
`;
