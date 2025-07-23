import { css } from "@emotion/react";
import { size } from "@evg-ui/lib/constants/tokens";

export const fullWidthCss = css`
  grid-column: span 2;
`;

export const radioCSS = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: ${size.xs};
  margin-bottom: 0px;
  max-width: 100%;
`;
