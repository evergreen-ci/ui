import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Link } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { statusColorMap, statusIconMap } from "./icons";

const { black, white } = palette;

export const SQUARE_SIZE = 16;
export const SQUARE_BORDER = 1;

const getTaskStatusStyle = (status: TaskStatus) => {
  const icon = statusIconMap?.[status];
  const iconStyle = icon ? `background-image: ${icon};` : "";
  return css`
    ${iconStyle}
    background-color: ${statusColorMap[status]};
  `;
};

const getTaskBoxStyles = () => css`
  width: ${SQUARE_SIZE}px;
  height: ${SQUARE_SIZE}px;
  border: ${SQUARE_BORDER}px solid ${white};
  box-sizing: content-box;
  float: left;
  position: relative;
`;

export const TaskBoxDiv = styled.div<{ status?: TaskStatus }>`
  ${getTaskBoxStyles()}
  ${({ status }) => (status ? getTaskStatusStyle(status) : "")};
`;

export const TaskBoxLink = styled(Link)<{
  status: TaskStatus;
  tooltip: boolean;
  rightmost: boolean;
}>`
  ${getTaskBoxStyles()}
  ${({ status }) => (status ? getTaskStatusStyle(status) : "")};
  cursor: pointer;

  ${({ rightmost, tooltip }) =>
    tooltip
      ? `:before {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 5px);
    left: 50%;
    transform: ${rightmost ? "translate(-90%)" : "translate(-50%)"};
    z-index: 1;
    width: max-content;
    max-width: 450px;
    overflow-wrap: break-word;
    padding: ${size.xs};
    border-radius: 6px;
    background: ${black};
    color: ${white};
    text-align: center;
    display: none;
  }
  :hover:before {
    display: block;
  }

  /* Tooltip caret */
  :hover:after {
    content: "";
    position: absolute;
    bottom: calc(100% - 5px);
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: ${black} transparent transparent transparent;
  }
  `
      : ""}
`;
