import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants";
import { TaskStatus } from "@evg-ui/lib/types";
import { statusColorMap, statusIconMap } from "./icons";

const { black, gray, white } = palette;

const SQUARE_SIZE = 16;
const SQUARE_BORDER = 1;
export const SQUARE_WITH_BORDER = SQUARE_SIZE + SQUARE_BORDER * 2;

export { statusColorMap };

const getTaskStatusStyle = (status: TaskStatus) => {
  const icon = statusIconMap?.[status];
  const iconStyle = icon ? `background-image: ${icon};` : "";
  return css`
    ${iconStyle}
    background-color: ${statusColorMap[status]};
  `;
};

const getCollapsedTaskBoxStyles = () => css`
  min-width: ${SQUARE_SIZE}px;
  width: fit-content;
  background-color: ${gray.light2};
  border-radius: ${size.xxs};
  text-align: center;
`;

const getTaskBoxStyles = () => css`
  width: ${SQUARE_SIZE}px;
  height: ${SQUARE_SIZE}px;
  border: ${SQUARE_BORDER}px solid ${white};
  box-sizing: content-box;
  float: left;
  position: relative;
`;

interface TaskBoxProps {
  status: TaskStatus;
  tooltip?: string;
  rightmost?: boolean;
}

type PolymorphicProps<E extends React.ElementType> = TaskBoxProps & {
  as?: E;
} & Omit<React.ComponentPropsWithoutRef<E>, keyof TaskBoxProps>;

const PolymorphicTaskBox = styled.div<TaskBoxProps>`
  ${getTaskBoxStyles()}
  ${({ status }) => getTaskStatusStyle(status)};

  ${({ rightmost, tooltip }) =>
    tooltip &&
    `
  cursor: pointer;

  :before {
    content: "${tooltip}";
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
  `}
`;

export const TaskBox = <E extends React.ElementType = "div">(
  props: PolymorphicProps<E>,
) => {
  const { as, ...rest } = props;
  return <PolymorphicTaskBox as={as} {...rest} />;
};

export const CollapsedBox = styled.div`
  ${getTaskBoxStyles()}
  ${getCollapsedTaskBoxStyles()}
`;
