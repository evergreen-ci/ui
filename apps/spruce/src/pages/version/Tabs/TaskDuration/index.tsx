import { useEffect, useMemo } from "react";
import { skipToken, useQuery } from "@apollo/client/react";
import { TableControl, TableWrapper } from "@evg-ui/lib/components/Table";
import { PaginationQueryParams } from "@evg-ui/lib/constants/pagination";
import { useErrorToast, useQueryParams } from "@evg-ui/lib/hooks";
import { useVersionAnalytics } from "analytics";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { TableQueryParams } from "constants/queryParams";
import {
  SortDirection,
  TaskSortCategory,
  VersionTaskDurationsQuery,
  VersionTaskDurationsQueryVariables,
} from "gql/generated/types";
import { VERSION_TASK_DURATIONS } from "gql/queries";
import { usePolling } from "hooks";
import { PatchTasksQueryParams } from "types/task";
import { useQueryVariables } from "../useQueryVariables";
import TaskDurationTable from "./TaskDurationTable";

interface Props {
  taskCount: number;
  versionId: string;
}
const TaskDuration: React.FC<Props> = ({ taskCount, versionId }) => {
  const [queryParams, setQueryParams] = useQueryParams();
  const versionAnalytics = useVersionAnalytics(versionId);
  const queryVariables = useQueryVariables(versionId);
  const hasQueryVariables = Object.keys(queryParams).length > 0;
  const { limit, page, sorts } = queryVariables.taskFilterOptions;

  const hasValidSortsForTab = useMemo(
    () => sorts?.some((s) => validSortCategories.includes(s.Key)) || false,
    [sorts],
  );

  useEffect(() => {
    if (!hasValidSortsForTab) {
      setQueryParams({
        ...queryParams,
        [TableQueryParams.Sorts]: defaultSort,
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearQueryParams = () => {
    setQueryParams({
      ...queryParams,
      [PatchTasksQueryParams.TaskName]: undefined,
      [PatchTasksQueryParams.Variant]: undefined,
      [PatchTasksQueryParams.Statuses]: undefined,
      [PatchTasksQueryParams.BaseStatuses]: undefined,
      [PaginationQueryParams.Page]: undefined,
      [TableQueryParams.Sorts]: defaultSort,
    });
  };

  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
    VersionTaskDurationsQuery,
    VersionTaskDurationsQueryVariables
  >(
    VERSION_TASK_DURATIONS,
    hasQueryVariables
      ? {
          variables: queryVariables,
          pollInterval: DEFAULT_POLL_INTERVAL,
        }
      : skipToken,
  );
  useErrorToast(error, "Error fetching patch tasks");
  usePolling<VersionTaskDurationsQuery, VersionTaskDurationsQueryVariables>({
    startPolling,
    stopPolling,
    refetch,
  });
  const { version } = data || {};
  const { tasks } = version || {};
  const { count = 0, data: tasksData = [] } = tasks || {};
  const shouldShowBottomTableControl = tasksData.length > 10;

  return (
    <TableWrapper
      controls={
        <TableControl
          filteredCount={count}
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          limit={limit}
          loading={loading}
          onClear={clearQueryParams}
          onPageSizeChange={(l) => {
            versionAnalytics.sendEvent({
              name: "Changed page size",
              "page.size": l,
            });
          }}
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          page={page}
          totalCount={taskCount}
        />
      }
      shouldShowBottomTableControl={shouldShowBottomTableControl}
    >
      <TaskDurationTable
        loading={loading}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        numLoadingRows={limit}
        tasks={tasksData}
      />
    </TableWrapper>
  );
};

export default TaskDuration;

const validSortCategories = [
  TaskSortCategory.Name,
  TaskSortCategory.Status,
  TaskSortCategory.Variant,
  TaskSortCategory.Duration,
];
const defaultSort = `${TaskSortCategory.Duration}:${SortDirection.Desc}`;
