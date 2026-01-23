import { useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { useLocation } from "react-router-dom";
import { PaginationQueryParams } from "@evg-ui/lib/constants/pagination";
import { useErrorToast } from "@evg-ui/lib/hooks";
import { useVersionAnalytics } from "analytics";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import {
  VersionTasksQuery,
  VersionTasksQueryVariables,
  TaskSortCategory,
  SortDirection,
} from "gql/generated/types";
import { VERSION_TASKS } from "gql/queries";
import { usePolling } from "hooks";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { PatchTasksQueryParams } from "types/task";
import { parseQueryString } from "utils/queryString";
import { useQueryVariables } from "../useQueryVariables";
import { VersionTasksTable } from "./VersionTasksTable";

interface Props {
  setActiveTaskIds: React.Dispatch<React.SetStateAction<string[]>>;
  taskCount: number;
  versionId: string;
}

const Tasks: React.FC<Props> = ({ setActiveTaskIds, taskCount, versionId }) => {
  const { search } = useLocation();
  const updateQueryParams = useUpdateURLQueryParams();
  const versionAnalytics = useVersionAnalytics(versionId || "");
  const queryVariables = useQueryVariables(search, versionId || "");
  const hasQueryVariables = Object.keys(parseQueryString(search)).length > 0;
  const { limit, page, sorts } = queryVariables.taskFilterOptions;

  useEffect(() => {
    const hasValidSortsForTab =
      sorts?.some((s) => validSortCategories.includes(s.Key)) || false;
    if (!hasValidSortsForTab) {
      updateQueryParams({
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        [PatchTasksQueryParams.Duration]: undefined,
        [PatchTasksQueryParams.Sorts]: defaultSortMethod,
      });
    }
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
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      [PatchTasksQueryParams.Duration]: undefined,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      [PatchTasksQueryParams.IncludeNeverActivatedTasks]: undefined,
      [PatchTasksQueryParams.Sorts]: defaultSortMethod,
    });
    versionAnalytics.sendEvent({
      name: "Deleted all filters",
    });
  };

  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
    VersionTasksQuery,
    VersionTasksQueryVariables
  >(VERSION_TASKS, {
    variables: queryVariables,
    pollInterval: DEFAULT_POLL_INTERVAL,
    skip: !hasQueryVariables,
    fetchPolicy: "cache-and-network",
  });
  useErrorToast(error, "Error fetching patch tasks");
  usePolling<VersionTasksQuery, VersionTasksQueryVariables>({
    startPolling,
    stopPolling,
    refetch,
  });
  const { version } = data || {};
  const { isPatch, tasks } = version || {};
  const { count = 0, data: tasksData = [] } = tasks || {};

  const activeTaskIds = useMemo(
    () => tasksData.map(({ id }) => id),
    [tasksData],
  );

  useEffect(() => {
    // Track the tasks currently shown by the tasks table in order to allow multiple tasks to be activated.
    // If no filters are applied, unset active tasks in order to activate the entire version.
    if (count === taskCount) {
      setActiveTaskIds([]);
    } else {
      setActiveTaskIds(activeTaskIds);
    }
  }, [activeTaskIds]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <VersionTasksTable
      clearQueryParams={clearQueryParams}
      filteredCount={count}
      isPatch={isPatch ?? false}
      limit={limit ?? 0}
      loading={tasksData.length === 0 && loading}
      page={page ?? 0}
      tasks={tasksData}
      totalCount={taskCount}
      versionId={versionId}
    />
  );
};

export default Tasks;

const validSortCategories = [
  TaskSortCategory.Name,
  TaskSortCategory.Status,
  TaskSortCategory.BaseStatus,
  TaskSortCategory.Variant,
];
const defaultSortMethod = `${TaskSortCategory.Status}:${SortDirection.Asc};${TaskSortCategory.BaseStatus}:${SortDirection.Desc}`;
