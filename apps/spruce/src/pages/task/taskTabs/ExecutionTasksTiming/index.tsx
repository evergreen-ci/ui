import { useMemo } from "react";
import styled from "@emotion/styled";
import { Body, BodyProps, H2 } from "@leafygreen-ui/typography";
import { fontSize, size } from "@evg-ui/lib/constants/tokens";
import { TaskQuery } from "gql/generated/types";
import {
  GanttChartData,
  GanttChartDataRow,
  GANTT_CHART_COLUMN_HEADERS,
} from "pages/version/Tabs/VersionTiming/types";
import VersionTimingGraph from "pages/version/Tabs/VersionTiming/VersionTimingGraph";

interface Props {
  executionTasksFull: NonNullable<TaskQuery["task"]>["executionTasksFull"];
  taskId: string;
  taskName: string;
}

const ExecutionTasksTiming: React.FC<Props> = ({
  executionTasksFull,
  taskId,
  taskName,
}) => {
  const chartData = useMemo((): GanttChartData => {
    if (!executionTasksFull || executionTasksFull.length === 0) {
      return [GANTT_CHART_COLUMN_HEADERS];
    }

    const rows = executionTasksFull.reduce<GanttChartDataRow[]>((acc, task) => {
      if (!task.startTime || !task.finishTime) {
        return acc;
      }

      acc.push([
        task.id,
        task.displayName,
        task.displayName,
        new Date(task.startTime),
        new Date(task.finishTime),
        null,
        100,
        null,
      ]);

      return acc;
    }, []);

    return [GANTT_CHART_COLUMN_HEADERS, ...rows];
  }, [executionTasksFull]);

  return (
    <>
      <H2>Execution Tasks Timing</H2>
      <StyledBody>
        This page shows a timeline view of execution task run times for{" "}
        <b>{taskName}</b>. This is a Gantt chart showing when each execution
        task started and finished running. Click on a task to visit its page.
      </StyledBody>
      <VersionTimingGraph
        data={chartData}
        dataType="task"
        loading={false}
        versionId={taskId}
      />
    </>
  );
};

const StyledBody = styled(Body)<BodyProps>`
  font-size: ${fontSize.m};
  margin-bottom: ${size.s};
`;

export default ExecutionTasksTiming;
