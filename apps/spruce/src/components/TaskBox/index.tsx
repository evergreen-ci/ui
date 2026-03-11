import { forwardRef } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants/tokens";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { statusColorMap, statusIconMap } from "./icons";

const { black, gray, white } = palette;

const DEFAULT_SQUARE_SIZE = 16;
const SQUARE_BORDER = 1;
export const SQUARE_WITH_BORDER = DEFAULT_SQUARE_SIZE + SQUARE_BORDER * 2;

export { statusColorMap };

interface TaskBoxProps {
  status: TaskStatus;
}

type PolymorphicProps<E extends React.ElementType> = TaskBoxProps & {
  as?: E;
} & Omit<React.ComponentPropsWithoutRef<E>, keyof TaskBoxProps>;

const statusStyles = Object.entries(statusColorMap)
  .map(([status, color]) => {
    const icon = statusIconMap[status as TaskStatus];
    return `
    &[data-status="${status}"] {
      background-color: ${color};
      ${icon ? `background-image: ${icon}; background-size: cover;` : ""}
    }`;
  })
  .join("\n");

const PolymorphicTaskBox = styled.div`
  width: ${DEFAULT_SQUARE_SIZE}px;
  height: ${DEFAULT_SQUARE_SIZE}px;
  border: ${SQUARE_BORDER}px solid ${white};
  box-sizing: content-box;
  float: left;
  position: relative;
  cursor: pointer;

  ${statusStyles}

  &[data-tooltip]:before {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 5px);
    left: 50%;
    transform: translate(-50%);
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

  [data-rightmost-build] &[data-tooltip]:before {
    transform: translate(-90%);
  }

  &[data-tooltip]:hover:before {
    display: block;
  }

  &[data-tooltip]:hover:after {
    content: "";
    position: absolute;
    bottom: calc(100% - 5px);
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: ${black} transparent transparent transparent;
  }
`;

export const TaskBox = forwardRef<
  HTMLDivElement,
  PolymorphicProps<React.ElementType>
>(({ as, status, ...rest }, ref) => (
  <PolymorphicTaskBox ref={ref} as={as} data-status={status} {...rest} />
));

TaskBox.displayName = "TaskBox";

export const CollapsedBox = styled.div`
  width: ${DEFAULT_SQUARE_SIZE}px;
  height: ${DEFAULT_SQUARE_SIZE}px;
  border: ${SQUARE_BORDER}px solid ${white};
  box-sizing: content-box;
  float: left;
  position: relative;
  min-width: ${DEFAULT_SQUARE_SIZE}px;
  width: fit-content;
  background-color: ${gray.light2};
  border-radius: ${size.xxs};
  text-align: center;
`;
