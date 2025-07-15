import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Body, BodyProps, H2 } from "@leafygreen-ui/typography";
import { useLocation } from "react-router-dom";
import { TableControl } from "@evg-ui/lib/components/Table";
import { PaginationQueryParams } from "@evg-ui/lib/constants/pagination";
import { fontSize, size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useQueryParams } from "@evg-ui/lib/hooks";
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
import {
  transformTaskDurationDataToVariantGanttChartData,
  transformTaskDurationDataToTaskGanttChartData,
} from "./utils";
import VersionTimingGraph from "./VersionTimingGraph";

interface Props {
  versionId: string;
  taskCount: number;
}

const defaultSort = `${TaskSortCategory.Duration}:${SortDirection.Desc}`;

const VersionTiming: React.FC<Props> = ({ taskCount, versionId }) => {
  const dispatchToast = useToastContext();
  const { search } = useLocation();

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

  const { data, loading, refetch, startPolling, stopPolling } = useQuery<
    VersionTaskDurationsQuery,
    VersionTaskDurationsQueryVariables
  >(VERSION_TASK_DURATIONS, {
    variables: {
      ...queryVariables,
      taskFilterOptions,
    },
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
      <b>{queryParams.variant}</b> variant{taskFilterDescription}. This is a
      Gantt chart showing when each task started and finished running. You can
      click on a task to visit the task page.
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
      <VersionTimingGraph
        data={chartData}
        dataType={isVariantTimingView ? "task" : "variant"}
        loading={loading}
        versionId={versionId}
      />
    </>
  );
};
const StyledBody = styled(Body)<BodyProps>`
  font-size: ${fontSize.m};
  margin-bottom: ${size.s};
`;

export default VersionTiming;
