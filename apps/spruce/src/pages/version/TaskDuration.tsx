import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import TableControl from "components/Table/TableControl";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { slugs } from "constants/routes";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  VersionTaskDurationsQuery,
  VersionTaskDurationsQueryVariables,
} from "gql/generated/types";
import { VERSION_TASK_DURATIONS } from "gql/queries";
import { usePolling } from "hooks";
import { useQueryParams } from "hooks/useQueryParam";
import { PatchTasksQueryParams } from "types/task";
import { TaskDurationTable } from "./taskDuration/TaskDurationTable";
import useVersionTasksQueryVariables from "./useVersionTasksQueryVariables";

interface Props {
  taskCount: number;
}

const TaskDuration: React.FC<Props> = ({ taskCount }) => {
  const dispatchToast = useToastContext();
  const { [slugs.versionId]: versionId } = useParams();

  const [queryParams, setQueryParams] = useQueryParams();
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const versionAnalytics = useVersionAnalytics(versionId);
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const queryVariables = useVersionTasksQueryVariables(versionId);
  const { limit, page } = queryVariables.taskFilterOptions;

  useEffect(() => {
    setQueryParams({
      ...queryParams,
      [PatchTasksQueryParams.Duration]: "DESC",
      [PatchTasksQueryParams.Sorts]: undefined,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearQueryParams = () => {
    setQueryParams({
      [PatchTasksQueryParams.Duration]: "DESC",
    });
  };

  const { data, loading, refetch, startPolling, stopPolling } = useQuery<
    VersionTaskDurationsQuery,
    VersionTaskDurationsQueryVariables
  >(VERSION_TASK_DURATIONS, {
    variables: queryVariables,
    pollInterval: DEFAULT_POLL_INTERVAL,
    onError: (err) => {
      dispatchToast.error(`Error fetching patch tasks ${err}`);
    },
  });
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  usePolling({ startPolling, stopPolling, refetch });
  const { version } = data || {};
  const { tasks } = version || {};
  const { count = 0, data: tasksData = [] } = tasks || {};
  const shouldShowBottomTableControl = tasksData.length > 10;

  return (
    <>
      <TableControl
        filteredCount={count}
        totalCount={taskCount}
        limit={limit}
        page={page}
        label="tasks"
        onClear={clearQueryParams}
        onPageSizeChange={() => {
          versionAnalytics.sendEvent({
            name: "Change Page Size",
          });
        }}
      />
      <TaskDurationTable
        tasks={tasksData}
        loading={loading}
        numLoadingRows={limit}
      />
      {shouldShowBottomTableControl && (
        <TableControlWrapper>
          <TableControl
            filteredCount={count}
            totalCount={taskCount}
            limit={limit}
            label="tasks"
            page={page}
            onClear={clearQueryParams}
            onPageSizeChange={() => {
              versionAnalytics.sendEvent({
                name: "Change Page Size",
              });
            }}
          />
        </TableControlWrapper>
      )}
    </>
  );
};
const TableControlWrapper = styled.div`
  padding-top: ${size.xs};
  margin-bottom: ${size.l};
`;

export default TaskDuration;
