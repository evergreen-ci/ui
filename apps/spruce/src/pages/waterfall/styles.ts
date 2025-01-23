import { css, SerializedStyles } from "@emotion/react";
import styled from "@emotion/styled";
import { wordBreakCss } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { VERSION_LIMIT } from "./constants";
import { statusColorMap, statusIconMap } from "./icons";

const BUILD_VARIANT_WIDTH = 200;
const INACTIVE_WIDTH = 80;
export const SQUARE_SIZE = 16;

export const columnBasis = css`
  flex-basis: calc(100% / ${VERSION_LIMIT});
`;

export const gridGroupCss = css`
  display: flex;
  gap: ${size.s};
  flex-grow: 1;
`;

export const BuildVariantTitle = styled.div`
  ${wordBreakCss}
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  gap: ${size.xxs};
  height: min-content;
  width: ${BUILD_VARIANT_WIDTH}px;
`;

export const Row = styled.div`
  display: flex;
  gap: ${size.xs};
  margin-bottom: ${size.s};
`;

export const InactiveVersion = styled.div`
  flex-shrink: 0;
  flex-basis: ${INACTIVE_WIDTH}px;
  text-align: center;
`;

export const taskStatusStyleMap = Object.values(TaskStatus).reduce(
  (obj, status) => {
    const icon = statusIconMap?.[status];
    const iconStyle = icon ? `background-image: ${icon};` : "";
    return {
      ...obj,
      [status]: css`
        ${iconStyle}
        background-color: ${statusColorMap[status]};
      `,
    };
  },
  {} as Record<TaskStatus, SerializedStyles>,
);
