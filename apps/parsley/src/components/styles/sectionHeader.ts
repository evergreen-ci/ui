import { palette } from "@leafygreen-ui/palette";
import { css } from "@linaria/core";
import { size } from "@evg-ui/lib/constants/tokens";

export const sectionHeaderWrapperStyle = css`
  display: flex;
  align-items: center;
  gap: ${size.xs};
  padding: ${size.xxs} 0;
  border-bottom: 1px solid ${palette.gray.light2};
`;

export const subsectionHeaderWrapperStyle = css`
  display: flex;
  align-items: center;
  gap: ${size.xs};
  padding: ${size.xxs} 0;
  padding-left: 48px;
  border-bottom: 1px solid ${palette.gray.light1};
  background-color: ${palette.gray.light2};
`;
