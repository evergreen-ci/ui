import { useMemo } from "react";
import { useParams } from "react-router-dom";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
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
import { useQueryParams } from "@evg-ui/lib/hooks";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { useVersionAnalytics } from "analytics";
import { TaskLink } from "components/TasksTable/TaskLink";
import { TableQueryParams } from "constants/queryParams";
import { slugs } from "constants/routes";
import {
  SortDirection,
  TaskSortCategory,
  VersionTaskDurationsQuery,
} from "gql/generated/types";
import { useTableSort, useTaskStatuses } from "hooks";
import { PatchTasksQueryParams } from "types/task";
import { parseSortString } from "utils/queryString";
import { TaskDurationCell } from "./TaskDurationCell";

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
  tasks: TaskDurationData[];
  loading: boolean;
  numLoadingRows: number;
}

const TaskDurationTable: React.FC<Props> = ({
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
      [PatchTasksQueryParams.Statuses]: undefined,
      [PatchTasksQueryParams.TaskName]: undefined,
      [PatchTasksQueryParams.Variant]: undefined,
    };

    filterState.forEach(({ id, value }) => {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      updatedParams[id] = value;
    });

    setQueryParams(updatedParams);
    sendEvent({
      "filter.by": Object.keys(filterState),
      name: "Filtered task duration table",
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
    () => getColumns(statusOptions),
    [statusOptions],
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
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      initialState: {
        columnFilters: initialFilters,
        sorting: initialSort,
      },
      isMultiSortEvent: () => true, // Override default requirement for shift-click to multisort.
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
            desc,
            id: columnIdToSortCategory[id],
          })),
        );
      }),
    });

  return (
    <BaseTable
      data-cy="task-duration-table"
      data-cy-row="task-duration-table-row"
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
): LGColumnDef<TaskDurationData>[] => [
  {
    accessorKey: "displayName",
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
    enableColumnFilter: true,
    enableSorting: true,
    header: "Task Name",
    id: PatchTasksQueryParams.TaskName,
    meta: {
      search: {
        "data-cy": "task-name-filter-popover",
        placeholder: "Task name regex",
      },
    },
    size: 250,
  },
  {
    accessorKey: "displayStatus",
    cell: ({ getValue }) => (
      <TaskStatusBadge status={getValue() as TaskStatus} />
    ),
    enableColumnFilter: true,
    enableSorting: true,
    header: "Status",
    id: PatchTasksQueryParams.Statuses,
    meta: {
      treeSelect: {
        "data-cy": "status-filter-popover",
        options: statusOptions,
      },
    },
    size: 120,
  },
  {
    accessorKey: "buildVariantDisplayName",
    enableColumnFilter: true,
    enableSorting: true,
    header: "Build Variant",
    id: PatchTasksQueryParams.Variant,
    meta: {
      search: {
        "data-cy": "build-variant-filter-popover",
        placeholder: "Build variant regex",
      },
    },
    size: 150,
  },
  {
    accessorKey: "timeTaken",
    cell: ({
      column,
      getValue,
      row: {
        original: { displayStatus },
      },
    }) => (
      <TaskDurationCell
        maxTimeTaken={column.getFacetedMinMaxValues()?.[1] ?? 0}
        status={displayStatus}
        timeTaken={getValue() as number}
      />
    ),
    enableColumnFilter: false,
    enableSorting: true,
    header: "Task Duration",
    id: PatchTasksQueryParams.Duration,
    size: 250,
  },
];

const columnIdToSortCategory: { [key: string]: TaskSortCategory } = {
  [PatchTasksQueryParams.Duration]: TaskSortCategory.Duration,
  [PatchTasksQueryParams.Statuses]: TaskSortCategory.Status,
  [PatchTasksQueryParams.TaskName]: TaskSortCategory.Name,
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
        sortCategoryEnum: TaskSortCategory,
        sortDirKey: "direction",
      }).map(({ direction, sortCategory }) => ({
        desc: direction === SortDirection.Desc,
        id: sortCategoryToColumnId[sortCategory],
      }))
    : [
        {
          desc: true,
          id: PatchTasksQueryParams.Duration,
        },
      ];

  return {
    initialFilters,
    initialSort,
  };
};

export default TaskDurationTable;
