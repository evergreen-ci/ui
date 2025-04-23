import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Body } from "@leafygreen-ui/typography";
import { useLocation } from "react-router-dom";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useVersionAnalytics } from "analytics";
import TableControl from "components/Table/TableControl";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { PaginationQueryParams, TableQueryParams } from "constants/queryParams";
import {
  SortDirection,
  TaskSortCategory,
  VersionTaskDurationsQuery,
  VersionTaskDurationsQueryVariables,
} from "gql/generated/types";
import { VERSION_TASK_DURATIONS } from "gql/queries";
import { usePolling } from "hooks";
import { useQueryParams } from "hooks/useQueryParam";
import { PatchTasksQueryParams } from "types/task";
import { parseQueryString } from "utils/queryString";
import { useQueryVariables } from "../useQueryVariables";
import {
  transformTaskDurationDataToVariantGanttChartData,
  transformTaskDurationDataToTaskGanttChartData,
} from "./utils";
import VersionTimingGraph from "./VersionTimingGraph";

interface Props {
  versionId: string;
  taskCount: number;
}

const VersionTiming: React.FC<Props> = ({ taskCount, versionId }) => {
  const dispatchToast = useToastContext();
  const { search } = useLocation();

  const defaultSort = `${TaskSortCategory.Duration}:${SortDirection.Desc}`;
  const [queryParams, setQueryParams] = useQueryParams();
  const versionAnalytics = useVersionAnalytics(versionId);
  const queryVariables = useQueryVariables(search, versionId);
  const hasQueryVariables = Object.keys(parseQueryString(search)).length > 0;
  const hasBuildVariantQueryParam = !!queryParams.variant;
  const shouldPaginateData = hasBuildVariantQueryParam;

  useEffect(() => {
    setQueryParams({
      ...queryParams,
      [TableQueryParams.Sorts]: defaultSort,
    });
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

  const { data, loading, refetch, startPolling, stopPolling } = useQuery<
    VersionTaskDurationsQuery,
    VersionTaskDurationsQueryVariables
  >(VERSION_TASK_DURATIONS, {
    variables: {
      ...queryVariables,
      taskFilterOptions: {
        ...queryVariables.taskFilterOptions,
        limit:
          shouldPaginateData && queryVariables.taskFilterOptions.limit
            ? queryVariables.taskFilterOptions.limit
            : undefined,
      },
    },
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
  const { limit, page } = queryVariables.taskFilterOptions;

  const chartData = hasBuildVariantQueryParam
    ? transformTaskDurationDataToTaskGanttChartData(tasksData)
    : transformTaskDurationDataToVariantGanttChartData(tasksData);

  return (
    <>
      <Body>
        This page provides a timeline view of{" "}
        {hasBuildVariantQueryParam ? "task" : "variant"} wall clock duration in
        the version.
      </Body>
      <br />
      {shouldPaginateData && (
        <TableControl
          filteredCount={count}
          label="tasks"
          limit={limit || 0}
          onClear={clearQueryParams}
          onPageSizeChange={(l) => {
            versionAnalytics.sendEvent({
              name: "Changed page size",
              "page.size": l,
            });
          }}
          page={page || 0}
          totalCount={taskCount}
        />
      )}
      <VersionTimingGraph
        data={chartData}
        dataType={hasBuildVariantQueryParam ? "task" : "variant"}
        loading={loading}
        versionId={versionId}
      />
    </>
  );
};

export default VersionTiming;
