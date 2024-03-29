import { css } from "@emotion/react";
import styled from "@emotion/styled";

export const wordBreakCss = css`
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  word-break: normal;
  overflow-wrap: anywhere;
`;

export const WordBreak = styled.span`
  ${wordBreakCss};
`;

export const TextEllipsis = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
