import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";
import { useToastContext } from "@evg-ui/lib/context/toast";
import TableControl from "components/Table/TableControl";
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
import { useQueryParams } from "hooks/useQueryParam";
import { parseQueryString } from "utils/queryString";
import { useQueryVariables } from "../../useQueryVariables";
import TimeChartGraph from "../TimeChartGraph";
import { transformVersionDataToTaskGanttChartData } from "../utils";

interface Props {
  versionId: string;
  taskCount: number;
}

const defaultSort = `${TaskSortCategory.Duration}:${SortDirection.Desc}`;
const TaskTimeChart: React.FC<Props> = ({ taskCount, versionId }) => {
  const dispatchToast = useToastContext();
  const { search } = useLocation();

  const [queryParams, setQueryParams] = useQueryParams();
  const queryVariables = useQueryVariables(search, versionId);
  const hasQueryVariables = Object.keys(parseQueryString(search)).length > 0;
  const { limit, page } = queryVariables.taskFilterOptions;

  useEffect(() => {
    setQueryParams({
      ...queryParams,
      [TableQueryParams.Sorts]: defaultSort,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  return (
    <>
      <TableControl
        filteredCount={count}
        label="tasks"
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        limit={limit}
        onClear={() => {}}
        onPageSizeChange={() => {}}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        page={page}
        showClearAllFiltersButton={false}
        totalCount={taskCount}
      />
      <TimeChartGraph
        data={transformVersionDataToTaskGanttChartData(tasksData)}
        loading={loading}
      />
    </>
  );
};

export default TaskTimeChart;
