import { useMemo } from "react";
import styled from "@emotion/styled";
import { Body, H2 } from "@leafygreen-ui/typography";
import { useNavigate } from "react-router-dom";
import { fontSize, size } from "@evg-ui/lib/constants/tokens";
import GanttChart from "components/GanttChart";
import {
  GanttChartData,
  GanttChartDataRow,
  GANTT_CHART_COLUMN_HEADERS,
} from "components/GanttChart/types";
import { getTaskRoute } from "constants/routes";
import { TaskQuery } from "gql/generated/types";

interface Props {
  executionTasksFull: NonNullable<TaskQuery["task"]>["executionTasksFull"];
  taskName: string;
}

const ExecutionTasksTiming: React.FC<Props> = ({
  executionTasksFull,
  taskName,
}) => {
  const navigate = useNavigate();
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
      <GanttChart
        data={chartData}
        loading={false}
        onRowClick={(selectedId) => {
          navigate(getTaskRoute(selectedId));
        }}
      />
    </>
  );
};

const StyledBody = styled(Body)`
  font-size: ${fontSize.m};
  margin-bottom: ${size.s};
`;

export default ExecutionTasksTiming;
