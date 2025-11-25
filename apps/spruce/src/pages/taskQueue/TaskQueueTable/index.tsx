import { useEffect, useMemo, useState, useRef } from "react";
import styled from "@emotion/styled";
import { Badge } from "@leafygreen-ui/badge";
import { css } from "@leafygreen-ui/emotion";
import { Body } from "@leafygreen-ui/typography";
import {
  WordBreak,
  StyledRouterLink,
  wordBreakCss,
} from "@evg-ui/lib/components/styles";
import {
  LGColumnDef,
  useLeafyGreenVirtualTable,
  BaseTable,
  TablePlaceholder,
} from "@evg-ui/lib/components/Table";
import { useTaskQueueAnalytics } from "analytics";
import { isMainlineRequester, Requester } from "constants/requesters";
import {
  getVersionRoute,
  getTaskRoute,
  getUserPatchesRoute,
  getProjectPatchesRoute,
} from "constants/routes";
import { TaskQueueItem } from "gql/generated/types";
import { formatZeroIndexForDisplay } from "utils/numbers";
import { msToDuration } from "utils/string";

type TaskQueueColumnData = Omit<TaskQueueItem, "revision">;
interface TaskQueueTableProps {
  taskQueue: TaskQueueColumnData[];
  taskId?: string;
}
const estimateSize = () => 65;

const TaskQueueTable: React.FC<TaskQueueTableProps> = ({
  taskId,
  taskQueue = [],
}) => {
  const { sendEvent } = useTaskQueueAnalytics();
  const [selectedRowIndexes, setSelectedRowIndexes] = useState<number[]>([]);
  const columns = useMemo(() => taskQueueTableColumns(sendEvent), [sendEvent]);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenVirtualTable<TaskQueueColumnData>({
    containerRef: tableContainerRef,
    data: taskQueue,
    columns,
    enableColumnFilters: false,
    virtualizerOptions: {
      estimateSize,
    },
  });
  const performedInitialScroll = useRef(false);
  useEffect(() => {
    if (taskId !== undefined && !performedInitialScroll.current) {
      const i = taskQueue.findIndex((t) => t.id === taskId);
      setSelectedRowIndexes([i]);
      table.virtual.scrollToIndex(i, { align: "center" });
      setTimeout(() => {
        performedInitialScroll.current = true;
        table.virtual.scrollToIndex(i, { align: "center", behavior: "smooth" });
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, taskQueue]);

  return (
    <BaseTable
      ref={tableContainerRef}
      className={virtualScrollingContainerHeight}
      data-cy="task-queue-table"
      emptyComponent={<TablePlaceholder message="No tasks found in queue." />}
      selectedRowIndexes={selectedRowIndexes}
      shouldAlternateRowColor
      table={table}
    />
  );
};

const virtualScrollingContainerHeight = css`
  max-height: 100vh;
  width: 100%;
`;

const TaskCell = styled.div`
  display: flex;
  flex-direction: column;
  ${wordBreakCss};
`;

const taskQueueTableColumns = (
  sendEvent: ReturnType<typeof useTaskQueueAnalytics>["sendEvent"],
) => {
  const columns: LGColumnDef<TaskQueueColumnData>[] = [
    {
      header: "",
      cell: ({ row }) => (
        <Body weight="medium">{formatZeroIndexForDisplay(row.index)}</Body>
      ),
      align: "center",
      id: "index",
    },
    {
      header: "Task",
      accessorKey: "displayName",
      cell: (value) => {
        const { buildVariant, displayName, id } = value.row.original;
        return (
          <TaskCell>
            <StyledRouterLink
              data-cy="current-task-link"
              onClick={() => sendEvent({ name: "Clicked task link" })}
              to={getTaskRoute(id)}
            >
              {displayName}
            </StyledRouterLink>
            <Body>{buildVariant}</Body>
          </TaskCell>
        );
      },
    },
    {
      header: "Est. Runtime",
      accessorKey: "expectedDuration",
      align: "center",
      cell: (value) => msToDuration(value.row.original.expectedDuration),
    },
    {
      header: "Project",
      accessorKey: "projectIdentifier",
      cell: (value) => {
        const project =
          value.row.original.projectIdentifier || value.row.original.project;
        return (
          <StyledRouterLink
            onClick={() => sendEvent({ name: "Clicked project link" })}
            to={getProjectPatchesRoute(project)}
          >
            {project}
          </StyledRouterLink>
        );
      },
    },
    {
      header: "Version",
      accessorKey: "version",
      cell: (value) => (
        <StyledRouterLink
          onClick={() => sendEvent({ name: "Clicked version link" })}
          to={getVersionRoute(value.row.original.version)}
        >
          <WordBreak>{value.row.original.version}</WordBreak>
        </StyledRouterLink>
      ),
    },
    {
      header: "Priority",
      accessorKey: "priority",
      align: "center",
      cell: (value) => <Badge>{value.row.original.priority}</Badge>,
    },
    {
      header: "Activated By",
      accessorKey: "activatedBy",
      cell: (value) => (
        <StyledRouterLink
          onClick={() => sendEvent({ name: "Clicked activated by link" })}
          to={getUserPatchesRoute(value.row.original.activatedBy)}
        >
          <WordBreak>{value.row.original.activatedBy}</WordBreak>
        </StyledRouterLink>
      ),
    },
    {
      header: "Task Type",
      accessorKey: "requester",
      cell: (value) => {
        const { requester } = value.row.original;
        const copy = isMainlineRequester(requester as Requester)
          ? "Commit"
          : "Patch";
        return <Badge>{copy}</Badge>;
      },
    },
  ];

  return columns;
};

export default TaskQueueTable;
