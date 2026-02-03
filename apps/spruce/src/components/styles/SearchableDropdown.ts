import { css } from "@emotion/react";
import { palette } from "@leafygreen-ui/palette";
import { size, transitionDuration } from "@evg-ui/lib/constants";

const { gray } = palette;

export const hoverStyles = css`
  :hover {
    cursor: pointer;
    background-color: ${gray.light2};
  }
  transition-duration: ${transitionDuration.default}ms;
  transition-timing-function: ease-in-out;
  transition-delay: 0s;
  transition-behavior: normal;
  transition-property: background-color, color;
`;

export const overlineStyles = css`
  color: ${gray.dark1};
  padding: ${size.xxs} ${size.xs};
`;
