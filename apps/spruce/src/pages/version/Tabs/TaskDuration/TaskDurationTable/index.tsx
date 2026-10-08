import { useMemo } from "react";
import { useParams } from "react-router-dom";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import {
  BaseTable,
  ColumnFiltering,
  ColumnFiltersState,
  LGColumnDef,
  LeafyGreenTable,
  OnChangeFn,
  RowSorting,
  SortingState,
  TablePlaceholder,
  getFacetedMinMaxValues,
  onChangeHandler,
  useLeafyGreenTable,
} from "@evg-ui/lib/components/Table";
import { TreeDataEntry } from "@evg-ui/lib/components/TreeSelect";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { useVersionAnalytics } from "analytics";
import { TaskLink } from "components/TasksTable/TaskLink";
import { TableQueryParams } from "constants/queryParams";
import { getTaskRoute, slugs } from "constants/routes";
import {
  SortDirection,
  TaskSortCategory,
  VersionTaskDurationsQuery,
} from "gql/generated/types";
import { useTableSort, useTaskStatuses } from "hooks";
import { PatchTasksQueryParams } from "types/task";
import { formatZeroIndexForDisplay } from "utils/numbers";
import { parseSortString } from "utils/queryString";
import { msToDuration } from "utils/string";
import { TaskDurationCell } from "./TaskDurationCell";
import styles from "./TaskDurationTable.module.css";

const { getDefaultOptions: getDefaultFiltering } = ColumnFiltering;
const { getDefaultOptions: getDefaultSorting } = RowSorting;

type TaskDurationData = Unpacked<
  VersionTaskDurationsQuery["version"]["tasks"]["data"]
>;
interface TaskDurationQueryParams {
  [PatchTasksQueryParams.TaskName]?: string;
  [PatchTasksQueryParams.Statuses]?: string | string[];
  [PatchTasksQueryParams.Variant]?: string;
  [TableQueryParams.Sorts]?: string | string[];
}

interface Props {
  isPatch: boolean | undefined;
  tasks: TaskDurationData[];
  loading: boolean;
  numLoadingRows: number;
}

const TaskDurationTable: React.FC<Props> = ({
  isPatch,
  loading,
  numLoadingRows,
  tasks,
}) => {
  const { [slugs.versionId]: versionId } = useParams();
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { sendEvent } = useVersionAnalytics(versionId);
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { currentStatuses: statusOptions } = useTaskStatuses({ versionId });

  const [queryParams, setQueryParams] = useQueryParams();

  const { initialFilters, initialSort } = useMemo(
    () => getInitialParams(queryParams),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const setFilters = (f: ColumnFiltersState) =>
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    getDefaultFiltering(table).onColumnFiltersChange(f);

  const updateFilters = (filterState: ColumnFiltersState) => {
    const updatedParams = {
      ...queryParams,
      page: "0",
      [PatchTasksQueryParams.TaskName]: undefined,
      [PatchTasksQueryParams.Statuses]: undefined,
      [PatchTasksQueryParams.Variant]: undefined,
    };

    filterState.forEach(({ id, value }) => {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      updatedParams[id] = value;
    });

    setQueryParams(updatedParams);
    sendEvent({
      name: "Filtered task duration table",
      "filter.by": Object.keys(filterState),
    });
  };

  const setSorting: OnChangeFn<SortingState> = (s) =>
    getDefaultSorting?.(table).onSortingChange?.(s);
  const tableSortHandler = useTableSort({
    sendAnalyticsEvents: (sorter) =>
      sendEvent({
        name: "Sorted task duration table",
        "sort.by": sorter.map(({ id }) => id),
      }),
  });

  const columns: LGColumnDef<TaskDurationData>[] = useMemo(
    () => getColumns(statusOptions, isPatch),
    [statusOptions, isPatch],
  );

  const table: LeafyGreenTable<TaskDurationData> =
    useLeafyGreenTable<TaskDurationData>({
      columns,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      data: tasks ?? [],
      defaultColumn: {
        enableMultiSort: true,
        // Handle bug in sorting order
        // https://github.com/TanStack/table/issues/4289
        sortDescFirst: false,
      },
      isMultiSortEvent: () => true, // Override default requirement for shift-click to multisort.
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      initialState: {
        columnFilters: initialFilters,
        sorting: initialSort,
      },
      manualFiltering: true,
      manualPagination: true,
      manualSorting: true,
      onColumnFiltersChange: onChangeHandler<ColumnFiltersState>(
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        setFilters,
        (updatedState) => {
          updateFilters(updatedState);
          table.resetRowSelection();
        },
      ),
      onSortingChange: onChangeHandler<SortingState>(setSorting, (sorts) => {
        tableSortHandler(
          sorts.map(({ desc, id }) => ({
            id: columnIdToSortCategory[id],
            desc,
          })),
        );
      }),
    });

  return (
    <BaseTable
      className={styles.table}
      data-testid="task-duration-table"
      data-testid-row="task-duration-table-row"
      emptyComponent={<TablePlaceholder message="No tasks found." />}
      loading={loading}
      loadingRows={numLoadingRows}
      shouldAlternateRowColor
      table={table}
    />
  );
};

const getColumns = (
  statusOptions: TreeDataEntry[],
  isPatch: boolean | undefined,
): LGColumnDef<TaskDurationData>[] => [
  {
    id: PatchTasksQueryParams.TaskName,
    accessorKey: "displayName",
    header: "Task Name",
    size: 250,
    enableColumnFilter: true,
    enableSorting: true,
    cell: ({
      getValue,
      row: {
        original: { execution, id },
      },
    }) => (
      <TaskLink
        execution={execution}
        taskId={id}
        taskName={getValue() as string}
      />
    ),
    meta: {
      search: {
        "data-testid": "task-name-filter-popover",
        placeholder: "Task name regex",
      },
    },
  },
  {
    id: PatchTasksQueryParams.Statuses,
    accessorKey: "displayStatus",
    header: "Status",
    size: 120,
    enableColumnFilter: true,
    enableSorting: true,
    cell: ({ getValue }) => (
      <TaskStatusBadge status={getValue() as TaskStatus} />
    ),
    meta: {
      treeSelect: {
        "data-testid": "status-filter-popover",
        options: statusOptions,
      },
    },
  },
  {
    id: PatchTasksQueryParams.Variant,
    accessorKey: "buildVariantDisplayName",
    header: "Build Variant",
    size: 150,
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      search: {
        "data-testid": "build-variant-filter-popover",
        placeholder: "Build variant regex",
      },
    },
  },
  {
    id: PatchTasksQueryParams.Duration,
    accessorKey: "timeTaken",
    header: "Task Duration",
    enableColumnFilter: false,
    enableSorting: true,
    size: 250,
    cell: ({
      row: {
        original: { displayStatus, timeTaken },
      },
      table,
    }) => (
      <TaskDurationCell
        maxTimeTaken={getMaxTimeTaken(table)}
        status={displayStatus}
        timeTaken={timeTaken ?? 0}
      />
    ),
  },
  {
    id: "baseTaskDuration",
    accessorFn: ({ baseTask }) =>
      baseTask?.finishTime ? (baseTask.timeTaken ?? undefined) : undefined,
    header: `${getComparisonLabel(isPatch)} Task Duration`,
    enableColumnFilter: false,
    enableSorting: false,
    size: 250,
    cell: ({
      row: {
        original: { baseTask, displayName },
      },
      table,
    }) =>
      baseTask?.finishTime && baseTask.timeTaken != null ? (
        <TaskDurationCell
          maxTimeTaken={getMaxTimeTaken(table)}
          status={baseTask.displayStatus}
          timeTaken={baseTask.timeTaken}
        >
          <StyledRouterLink
            aria-label={`${getComparisonLabel(isPatch)} task duration for ${displayName}: ${msToDuration(baseTask.timeTaken)}`}
            title={`${taskStatusToCopy[baseTask.displayStatus as TaskStatus] ?? baseTask.displayStatus}, execution ${formatZeroIndexForDisplay(baseTask.execution)}; ${baseTask.timeTaken / 1000}s`}
            to={getTaskRoute(baseTask.id, { execution: baseTask.execution })}
          >
            {msToDuration(baseTask.timeTaken)}
          </StyledRouterLink>
        </TaskDurationCell>
      ) : (
        <span title={getUnavailableReason(baseTask)}>Unavailable</span>
      ),
  },
];

const getUnavailableReason = (baseTask: TaskDurationData["baseTask"]) => {
  if (!baseTask) {
    return "No matching task was found for this comparison.";
  }
  if (!baseTask.finishTime) {
    return "The comparison task has not finished.";
  }
  return "The comparison task has no recorded duration.";
};

const getComparisonLabel = (isPatch: boolean | undefined) => {
  if (isPatch === undefined) {
    return "Comparison";
  }
  return isPatch ? "Base" : "Previous";
};

const getMaxTimeTaken = (
  table: Pick<LeafyGreenTable<TaskDurationData>, "getColumn">,
) =>
  Math.max(
    table
      .getColumn(PatchTasksQueryParams.Duration)
      ?.getFacetedMinMaxValues()?.[1] ?? 0,
    table.getColumn("baseTaskDuration")?.getFacetedMinMaxValues()?.[1] ?? 0,
  );

const columnIdToSortCategory: { [key: string]: TaskSortCategory } = {
  [PatchTasksQueryParams.Duration]: TaskSortCategory.Duration,
  [PatchTasksQueryParams.TaskName]: TaskSortCategory.Name,
  [PatchTasksQueryParams.Statuses]: TaskSortCategory.Status,
  [PatchTasksQueryParams.Variant]: TaskSortCategory.Variant,
};

const sortCategoryToColumnId: { [key: string]: PatchTasksQueryParams } = {
  [TaskSortCategory.Duration]: PatchTasksQueryParams.Duration,
  [TaskSortCategory.Name]: PatchTasksQueryParams.TaskName,
  [TaskSortCategory.Status]: PatchTasksQueryParams.Statuses,
  [TaskSortCategory.Variant]: PatchTasksQueryParams.Variant,
};

export const getInitialParams = (
  queryParams: TaskDurationQueryParams,
): {
  initialFilters: ColumnFiltersState;
  initialSort: SortingState;
} => {
  const taskName = queryParams[PatchTasksQueryParams.TaskName];
  const statuses = queryParams[PatchTasksQueryParams.Statuses];
  const variant = queryParams[PatchTasksQueryParams.Variant];
  const sorts = queryParams[TableQueryParams.Sorts];

  const initialFilters = [];
  if (taskName) {
    initialFilters.push({
      id: PatchTasksQueryParams.TaskName,
      value: taskName,
    });
  }
  if (statuses) {
    initialFilters.push({
      id: PatchTasksQueryParams.Statuses,
      value: Array.isArray(statuses) ? statuses : [statuses],
    });
  }
  if (variant) {
    initialFilters.push({ id: PatchTasksQueryParams.Variant, value: variant });
  }

  const initialSort: SortingState = sorts
    ? parseSortString(sorts, {
        sortByKey: "sortCategory",
        sortDirKey: "direction",
        sortCategoryEnum: TaskSortCategory,
      }).map(({ direction, sortCategory }) => ({
        id: sortCategoryToColumnId[sortCategory],
        desc: direction === SortDirection.Desc,
      }))
    : [
        {
          id: PatchTasksQueryParams.Duration,
          desc: true,
        },
      ];

  return {
    initialFilters,
    initialSort,
  };
};

export default TaskDurationTable;
