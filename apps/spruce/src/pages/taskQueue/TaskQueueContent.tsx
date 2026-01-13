import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { TableSkeleton } from "@leafygreen-ui/skeleton-loader";
import { H3 } from "@leafygreen-ui/typography";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { useQueryParam, useErrorToast } from "@evg-ui/lib/hooks";
import { MCI_USER } from "constants/hosts";
import { getAllHostsRoute } from "constants/routes";
import {
  DistroTaskQueueQuery,
  DistroTaskQueueQueryVariables,
} from "gql/generated/types";
import { DISTRO_TASK_QUEUE } from "gql/queries";
import { QueryParams } from "types/task";
import TaskQueueTable from "./TaskQueueTable";

type TaskQueueContentProps = {
  distroId: string;
};

const TaskQueueContent: React.FC<TaskQueueContentProps> = ({ distroId }) => {
  const [taskId] = useQueryParam<string | undefined>(
    QueryParams.TaskId,
    undefined,
  );

  const {
    data: taskQueueItemsData,
    error: taskQueueError,
    loading: loadingTaskQueueItems,
  } = useQuery<DistroTaskQueueQuery, DistroTaskQueueQueryVariables>(
    DISTRO_TASK_QUEUE,
    {
      fetchPolicy: "cache-and-network",
      variables: { distroId },
    },
  );
  useErrorToast(taskQueueError, "There was an error loading task queue");

  return (
    <>
      <TableHeader>
        <H3>{distroId}</H3>
        <StyledRouterLink
          to={getAllHostsRoute({ distroId, startedBy: MCI_USER })}
        >
          View hosts
        </StyledRouterLink>
      </TableHeader>
      {loadingTaskQueueItems ? (
        <TableSkeleton numCols={8} numRows={10} />
      ) : (
        <TaskQueueTable
          taskId={taskId}
          taskQueue={taskQueueItemsData?.distroTaskQueue ?? []}
        />
      )}
    </>
  );
};

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  margin: ${size.m} 0 ${size.s} 0;
  gap: ${size.s};
`;

export default TaskQueueContent;
