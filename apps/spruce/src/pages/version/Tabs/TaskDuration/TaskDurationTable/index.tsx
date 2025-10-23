import { useMemo } from "react";
import { useParams } from "react-router-dom";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import {
  BaseTable,
  ColumnFiltering,
  ColumnFiltersState,
  getFacetedMinMaxValues,
  LeafyGreenTable,
  LGColumnDef,
  OnChangeFn,
  onChangeHandler,
  RowSorting,
  SortingState,
  TablePlaceholder,
  useLeafyGreenTable,
} from "@evg-ui/lib/components/Table";

import { useQueryParams } from "@evg-ui/lib/hooks";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { useVersionAnalytics } from "analytics";
import { TaskLink } from "components/TasksTable/TaskLink";
import { TableQueryParams } from "constants/queryParams";
import { slugs } from "constants/routes";
import {
  VersionTaskDurationsQuery,
  SortDirection,
  TaskSortCategory,
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
    () => [
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
            "data-cy": "task-name-filter-popover",
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
            "data-cy": "status-filter-popover",
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
            "data-cy": "build-variant-filter-popover",
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
      },
    ],
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

export const getInitialParams = (queryParams: {
  [key: string]: any;
}): {
  initialFilters: ColumnFiltersState;
  initialSort: SortingState;
} => {
  const {
    [PatchTasksQueryParams.TaskName]: taskName,
    [PatchTasksQueryParams.Statuses]: statuses,
    [PatchTasksQueryParams.Variant]: variant,
    [TableQueryParams.Sorts]: sorts,
  } = queryParams;

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
