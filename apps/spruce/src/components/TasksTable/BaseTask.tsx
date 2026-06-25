import { skipToken, useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import Icon from "@evg-ui/lib/components/Icon";
import { LGColumnDef } from "@evg-ui/lib/components/Table";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { statusColorMap } from "components/TaskBox";
import TaskStatusBadgeWithLink from "components/TaskStatusBadgeWithLink";
import {
  LastCompletedTaskQuery,
  LastCompletedTaskQueryVariables,
} from "gql/generated/types";
import { LAST_COMPLETED_TASK } from "gql/queries";
import { TaskTableInfo } from "./types";

const { gray } = palette;

const uncompletedStatuses = new Set([
  TaskStatus.Started,
  TaskStatus.Undispatched,
  TaskStatus.Unstarted,
  TaskStatus.Unscheduled,
  TaskStatus.Dispatched,
  TaskStatus.WillRun,
  TaskStatus.Inactive,
]);

export const getBaseTaskCell = (({
  getValue,
  row: {
    original: { baseTask },
  },
}) => {
  const baseTaskStatus = getValue() as TaskStatus;
  const isInProgress = uncompletedStatuses.has(baseTaskStatus);

  const { data } = useQuery<
    LastCompletedTaskQuery,
    LastCompletedTaskQueryVariables
  >(
    LAST_COMPLETED_TASK,
    isInProgress && baseTask
      ? {
          variables: { taskId: baseTask.id, execution: baseTask.execution },
        }
      : skipToken,
  );

  if (!baseTask) {
    return <TaskStatusBadge status={getValue() as TaskStatus} />;
  }

  if (isInProgress && data?.task?.prevTaskCompleted) {
    return (
      <Container>
        <TaskStatusBadgeWithLink
          execution={baseTask?.execution}
          id={baseTask?.id}
          status={getValue() as TaskStatus}
        />
        <Icon
          fill={
            statusColorMap[
              data?.task?.prevTaskCompleted?.displayStatus as TaskStatus
            ] ?? gray.base
          }
          glyph="Clock"
        />
      </Container>
    );
  }

  return (
    <TaskStatusBadgeWithLink
      execution={baseTask?.execution}
      id={baseTask?.id}
      status={getValue() as TaskStatus}
    />
  );
}) satisfies LGColumnDef<TaskTableInfo>["cell"];

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
