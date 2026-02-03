import { css } from "@emotion/react";
import { fontFamilies } from "@leafygreen-ui/tokens";
import { size } from "@evg-ui/lib/constants";

const textAreaCSS = css`
  box-sizing: border-box;
  textarea {
    font-family: ${fontFamilies.code};
  }
`;

const mergeCheckboxCSS = css`
  display: flex;
  justify-content: flex-end;
  margin-bottom: -20px;
`;

const indentCSS = css`
  box-sizing: border-box;
  padding-left: ${size.m};
`;

export { textAreaCSS, mergeCheckboxCSS, indentCSS };
