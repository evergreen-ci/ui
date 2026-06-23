import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import { WordBreak, StyledRouterLink } from "@evg-ui/lib/components/styles";
import { getTaskRoute } from "constants/routes";
import { formatZeroIndexForDisplay } from "utils/numbers";

interface TaskLinkProps {
  execution?: number;
  onClick?: (taskId: string, status?: string) => void;
  showTaskExecutionLabel?: boolean;
  status?: string;
  taskId: string;
  taskName: string;
}

export const TaskLink: React.FC<TaskLinkProps> = ({
  execution,
  onClick = () => {},
  showTaskExecutionLabel,
  status,
  taskId,
  taskName,
}) => (
  <StyledRouterLink
    onClick={() => onClick(taskId, status)}
    to={getTaskRoute(taskId, { execution })}
  >
    <WordBreakAll>{taskName}</WordBreakAll>
    {showTaskExecutionLabel && (
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      <Body>Execution {formatZeroIndexForDisplay(execution)}</Body>
    )}
  </StyledRouterLink>
);

const WordBreakAll = styled(WordBreak)`
  word-break: break-all;
`;
