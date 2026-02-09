import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Body, H2 } from "@leafygreen-ui/typography";
import { useLocation, useNavigate } from "react-router-dom";
import { TableControl } from "@evg-ui/lib/components";
import { fontSize, PaginationQueryParams, size } from "@evg-ui/lib/constants";
import { useQueryParams, useErrorToast } from "@evg-ui/lib/hooks";
import { useVersionAnalytics } from "analytics";
import GanttChart from "components/GanttChart";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { TableQueryParams } from "constants/queryParams";
import { getTaskRoute, getVersionRoute } from "constants/routes";
import {
  SortDirection,
  TaskSortCategory,
  VersionTaskDurationsQuery,
  VersionTaskDurationsQueryVariables,
} from "gql/generated/types";
import { VERSION_TASK_DURATIONS } from "gql/queries";
import { usePolling } from "hooks";
import { VersionPageTabs } from "types/patch";
import { PatchTasksQueryParams } from "types/task";
import { applyStrictRegex } from "utils/string";
import { useQueryVariables } from "../useQueryVariables";
import {
  transformTaskDurationDataToVariantGanttChartData,
  transformTaskDurationDataToTaskGanttChartData,
} from "./utils";

interface Props {
  versionId: string;
  taskCount: number;
}

const defaultSort = `${TaskSortCategory.Duration}:${SortDirection.Desc}`;

const VersionTiming: React.FC<Props> = ({ taskCount, versionId }) => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const [queryParams, setQueryParams] = useQueryParams();
  const versionAnalytics = useVersionAnalytics(versionId);
  const queryVariables = useQueryVariables(search, versionId);
  const isVariantTimingView = !!queryParams.variant;

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

  const taskFilterOptions = {
    // If the user is on the version timing view, we don't want to filter or paginate
    ...(isVariantTimingView ? queryVariables.taskFilterOptions : {}),
    limit: isVariantTimingView
      ? queryVariables.taskFilterOptions.limit
      : undefined,
  };

  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
    VersionTaskDurationsQuery,
    VersionTaskDurationsQueryVariables
  >(VERSION_TASK_DURATIONS, {
    variables: {
      ...queryVariables,
      taskFilterOptions,
    },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  useErrorToast(error, "Error fetching patch tasks");
  usePolling<VersionTaskDurationsQuery, VersionTaskDurationsQueryVariables>({
    startPolling,
    stopPolling,
    refetch,
  });
  const { version } = data || {};
  const { tasks } = version || {};
  const { count = 0, data: tasksData = [] } = tasks || {};
  const { limit, page } = queryVariables.taskFilterOptions;

  const chartData = isVariantTimingView
    ? transformTaskDurationDataToTaskGanttChartData(tasksData)
    : transformTaskDurationDataToVariantGanttChartData(tasksData);

  const taskFilterDescription = queryVariables.taskFilterOptions.taskName ? (
    <>
      {" "}
      filtered for tasks matching{" "}
      <b>{queryVariables.taskFilterOptions.taskName}</b>
    </>
  ) : (
    ""
  );

  const description = isVariantTimingView ? (
    <>
      This page is showing a timeline view of task run times in the{" "}
      <b>{queryVariables.taskFilterOptions.variant}</b> variant
      {taskFilterDescription}. This is a Gantt chart showing when each task
      started and finished running. You can click on a task to visit the task
      page.
    </>
  ) : (
    "This page is showing a timeline view of variant run times in this version. This is a Gantt chart showing when each variant started and finished running. You can click on a variant to see a view of the tasks that ran."
  );

  return (
    <>
      <H2>{isVariantTimingView ? "Variant" : "Version"} Timing</H2>
      <StyledBody>{description}</StyledBody>
      <TableControl
        disabled={!isVariantTimingView}
        filteredCount={isVariantTimingView ? count : chartData.length - 1}
        label={isVariantTimingView ? "tasks" : "variants"}
        limit={isVariantTimingView ? limit || 0 : chartData.length - 1}
        onClear={clearQueryParams}
        onPageSizeChange={(l: number) => {
          versionAnalytics.sendEvent({
            name: "Changed page size",
            "page.size": l,
          });
        }}
        page={isVariantTimingView ? page || 0 : 0}
        totalCount={isVariantTimingView ? taskCount : chartData.length - 1}
      />
      <GanttChart
        data={chartData}
        loading={loading}
        onRowClick={(selectedId) => {
          if (isVariantTimingView) {
            navigate(getTaskRoute(selectedId));
          } else {
            navigate(
              getVersionRoute(versionId, {
                tab: VersionPageTabs.VersionTiming,
                variant: applyStrictRegex(selectedId),
              }),
            );
          }
        }}
      />
    </>
  );
};
const StyledBody = styled(Body)`
  font-size: ${fontSize.m};
  margin-bottom: ${size.s};
`;

export default VersionTiming;
