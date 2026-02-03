import { css } from "@emotion/react";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants";

const { gray } = palette;

export const sectionHeaderWrapperStyle = css`
  display: flex;
  align-items: center;
  gap: ${size.xs};
  padding: ${size.xxs} 0;
  border-bottom: 1px solid ${gray.light2};
`;

export const subsectionHeaderWrapperStyle = css`
  display: flex;
  align-items: center;
  gap: ${size.xs};
  padding: ${size.xxs} 0;
  padding-left: 48px;
  border-bottom: 1px solid ${gray.light1};
  background-color: ${gray.light2};
`;
