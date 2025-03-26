import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Link } from "react-router-dom";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { statusColorMap, statusIconMap } from "./icons";

const { white } = palette;

export const SQUARE_SIZE = 16;
export const SQUARE_BORDER = 1;

export const getTaskStatusStyle = (status: TaskStatus) => {
  const icon = statusIconMap?.[status];
  const iconStyle = icon ? `background-image: ${icon};` : "";
  return css`
    ${iconStyle}
    background-color: ${statusColorMap[status]};
  `;
};

export const TaskBox = styled(Link)<{ status: TaskStatus }>`
  width: ${SQUARE_SIZE}px;
  height: ${SQUARE_SIZE}px;
  border: ${SQUARE_BORDER}px solid ${white};
  box-sizing: content-box;
  float: left;
  cursor: pointer;
  position: relative;
  ${({ status }) => getTaskStatusStyle(status)}
`;
