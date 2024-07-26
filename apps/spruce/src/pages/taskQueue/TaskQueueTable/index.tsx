import { useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { LGColumnDef, useLeafyGreenTable } from "@leafygreen-ui/table";
import { Body } from "@leafygreen-ui/typography";
import { useTaskQueueAnalytics } from "analytics";
import { StyledRouterLink, WordBreak } from "components/styles";
import { BaseTable } from "components/Table/BaseTable";
import { TablePlaceholder } from "components/Table/TablePlaceholder";
import {
  getVersionRoute,
  getTaskRoute,
  getUserPatchesRoute,
  getProjectPatchesRoute,
} from "constants/routes";
import { TaskQueueItem, TaskQueueItemType } from "gql/generated/types";
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
  const taskQueueAnalytics = useTaskQueueAnalytics();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [selectedRowIndexes, setSelectedRowIndexes] = useState<number[]>([]);
  const columns = useMemo(
    () => taskQueueTableColumns(taskQueueAnalytics.sendEvent),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const table = useLeafyGreenTable<TaskQueueColumnData>({
    data: taskQueue,
    columns,
    containerRef: tableContainerRef,
    useVirtualScrolling: true,
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
      table.scrollToIndex(i, { align: "center" });

      setTimeout(() => {
        performedInitialScroll.current = true;
        table.scrollToIndex(i, { align: "center" });
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, taskQueue]);

  return (
    <StyledBaseTable
      data-cy="task-queue-table"
      table={table}
      shouldAlternateRowColor
      emptyComponent={<TablePlaceholder message="No tasks found in queue." />}
      ref={tableContainerRef}
      selectedRowIndexes={selectedRowIndexes}
    />
  );
};

const StyledBaseTable = styled(BaseTable)`
  flex-grow: 1;
`;

const TaskCell = styled.div`
  display: flex;
  flex-direction: column;
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
              to={getTaskRoute(id)}
              onClick={() => sendEvent({ name: "Clicked task link" })}
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
            to={getProjectPatchesRoute(project)}
            onClick={() => sendEvent({ name: "Clicked project link" })}
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
          to={getVersionRoute(value.row.original.version)}
          onClick={() => sendEvent({ name: "Clicked version link" })}
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
          to={getUserPatchesRoute(value.row.original.activatedBy)}
          onClick={() => sendEvent({ name: "Clicked activated by link" })}
        >
          <WordBreak>{value.row.original.activatedBy}</WordBreak>
        </StyledRouterLink>
      ),
    },
    {
      header: "Task Type",
      accessorKey: "requester",
      cell: (value) => {
        const copy = {
          [TaskQueueItemType.Commit]: "Commit",
          [TaskQueueItemType.Patch]: "Patch",
        }[value.row.original.requester];
        return <Badge>{copy}</Badge>;
      },
    },
  ];

  return columns;
};

export default TaskQueueTable;
