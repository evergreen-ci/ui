import { useEffect, useMemo, useRef, useState } from "react";
import { Badge, BadgeVariant } from "@via-ds/components/badge";
import { Body } from "@via-ds/components/typography";
import { StyledRouterLink, WordBreak } from "@evg-ui/lib/components/styles";
import {
  BaseTable,
  LGColumnDef,
  TablePlaceholder,
  useLeafyGreenVirtualTable,
} from "@evg-ui/lib/components/Table";
import { useTaskQueueAnalytics } from "analytics";
import { Requester, isWaterfallRequester } from "constants/requesters";
import {
  getProjectPatchesRoute,
  getTaskRoute,
  getUserPatchesRoute,
  getVersionRoute,
} from "constants/routes";
import { TaskQueueItem } from "gql/generated/types";
import { formatZeroIndexForDisplay } from "utils/numbers";
import { msToDuration } from "utils/string";
import styles from "./index.module.css";

type TaskQueueColumnData = Omit<TaskQueueItem, "revision">;
interface TaskQueueTableProps {
  taskQueue: TaskQueueColumnData[];
  taskId?: string;
  loading?: boolean;
}
const estimateSize = () => 65;

const TaskQueueTable: React.FC<TaskQueueTableProps> = ({
  loading = false,
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
      className={styles.virtualScrollingContainer}
      data-testid="task-queue-table"
      emptyComponent={<TablePlaceholder message="No tasks found in queue." />}
      loading={loading}
      loadingRows={10}
      selectedRowIndexes={selectedRowIndexes}
      shouldAlternateRowColor
      table={table}
    />
  );
};

const taskQueueTableColumns = (
  sendEvent: ReturnType<typeof useTaskQueueAnalytics>["sendEvent"],
) => {
  const columns: LGColumnDef<TaskQueueColumnData>[] = [
    {
      header: "",
      cell: ({ row }) => (
        <Body className={styles.indexCell}>
          {formatZeroIndexForDisplay(row.index)}
        </Body>
      ),
      align: "center",
      id: "index",
      size: 100,
    },
    {
      header: "Task",
      accessorKey: "displayName",
      size: 400,
      cell: (value) => {
        const { buildVariant, displayName, id } = value.row.original;
        return (
          <div className={styles.taskCell}>
            <StyledRouterLink
              data-testid="current-task-link"
              onClick={() => sendEvent({ name: "Clicked task link" })}
              to={getTaskRoute(id)}
            >
              {displayName}
            </StyledRouterLink>
            <Body>{buildVariant}</Body>
          </div>
        );
      },
    },
    {
      header: "Est. Runtime",
      accessorKey: "expectedDuration",
      align: "center",
      size: 120,
      cell: (value) => msToDuration(value.row.original.expectedDuration),
    },
    {
      header: "Project",
      accessorKey: "projectIdentifier",
      size: NaN,
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
      size: NaN,
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
      cell: (value) => (
        <Badge variant={BadgeVariant.Status}>
          {value.row.original.priority}
        </Badge>
      ),
      size: 60,
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
        const copy = isWaterfallRequester(requester as Requester)
          ? "Commit"
          : "Patch";
        return <Badge variant={BadgeVariant.Status}>{copy}</Badge>;
      },
    },
  ];

  return columns;
};

export default TaskQueueTable;
