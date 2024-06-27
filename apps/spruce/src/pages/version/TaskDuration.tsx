import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useParams, useLocation } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import TableControl from "components/Table/TableControl";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { PaginationQueryParams } from "constants/queryParams";
import { slugs } from "constants/routes";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  VersionTaskDurationsQuery,
  VersionTaskDurationsQueryVariables,
} from "gql/generated/types";
import { VERSION_TASK_DURATIONS } from "gql/queries";
import { usePolling } from "hooks";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { PatchTasksQueryParams } from "types/task";
import { queryString } from "utils";
import { TaskDurationTable } from "./taskDuration/TaskDurationTable";
import { useQueryVariables } from "./useQueryVariables";

const { parseQueryString } = queryString;

interface Props {
  taskCount: number;
}

const TaskDuration: React.FC<Props> = ({ taskCount }) => {
  const dispatchToast = useToastContext();
  const { [slugs.versionId]: versionId } = useParams();
  const { search } = useLocation();

  const updateQueryParams = useUpdateURLQueryParams();
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const versionAnalytics = useVersionAnalytics(versionId);
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const queryVariables = useQueryVariables(search, versionId);
  const hasQueryVariables = Object.keys(parseQueryString(search)).length > 0;
  const { limit, page } = queryVariables.taskFilterOptions;

  useEffect(() => {
    updateQueryParams({
      [PatchTasksQueryParams.Duration]: "DESC",
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      [PatchTasksQueryParams.Sorts]: undefined,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearQueryParams = () => {
    updateQueryParams({
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      [PatchTasksQueryParams.TaskName]: undefined,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      [PatchTasksQueryParams.Variant]: undefined,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      [PatchTasksQueryParams.Statuses]: undefined,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      [PatchTasksQueryParams.BaseStatuses]: undefined,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      [PaginationQueryParams.Page]: undefined,
      [PatchTasksQueryParams.Duration]: "DESC",
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      [PatchTasksQueryParams.Sorts]: undefined,
    });
  };

  const { data, loading, refetch, startPolling, stopPolling } = useQuery<
    VersionTaskDurationsQuery,
    VersionTaskDurationsQueryVariables
  >(VERSION_TASK_DURATIONS, {
    variables: queryVariables,
    skip: !hasQueryVariables,
    pollInterval: DEFAULT_POLL_INTERVAL,
    onError: (err) => {
      dispatchToast.error(`Error fetching patch tasks ${err}`);
    },
  });
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
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        limit={limit}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
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
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        numLoadingRows={limit}
      />
      {shouldShowBottomTableControl && (
        <TableControlWrapper>
          <TableControl
            filteredCount={count}
            totalCount={taskCount}
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            limit={limit}
            label="tasks"
            // @ts-expect-error: FIXME. This comment was added by an automated script.
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
