import { css, SerializedStyles } from "@emotion/react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Link } from "react-router-dom";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { statusColorMap, statusIconMap } from "./icons";

const { white } = palette;

export const SQUARE_SIZE = 16;
export const SQUARE_BORDER = 1;

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

export const TaskBox = styled(Link)<{ status: TaskStatus }>`
  width: ${SQUARE_SIZE}px;
  height: ${SQUARE_SIZE}px;
  border: ${SQUARE_BORDER}px solid ${white};
  box-sizing: content-box;
  float: left;
  cursor: pointer;
  position: relative;
  ${({ status }) => taskStatusStyleMap[status]}
`;
