import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { wordBreakCss } from "components/styles";
import { size } from "constants/tokens";

const BUILD_VARIANT_WIDTH = 200;
const INACTIVE_WIDTH = 80;

export const gridGroupCss = css`
  display: flex;
  gap: ${size.s};
  flex-grow: 1;
  padding-left: ${size.xs};
  padding-right: ${size.xs};
`;

export const BuildVariantTitle = styled.div`
  ${wordBreakCss}
  flex-grow: 0;
  flex-shrink: 0;
  width: ${BUILD_VARIANT_WIDTH}px;
`;

export const Row = styled.div`
  display: flex;
  gap: ${size.xs};
  margin-bottom: ${size.s};
`;

export const InactiveVersion = styled.div`
  width: ${INACTIVE_WIDTH}px;
`;
