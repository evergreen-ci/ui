import { useMemo, useRef } from "react";
import {
  ColumnFiltersState,
  ColumnFiltering,
  RowSorting,
  SortingState,
  getFacetedMinMaxValues,
  useLeafyGreenTable,
  LGColumnDef,
  LeafyGreenTable,
  OnChangeFn,
} from "@leafygreen-ui/table";
import { useParams } from "react-router-dom";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { useVersionAnalytics } from "analytics";
import { BaseTable } from "components/Table/BaseTable";
import { TablePlaceholder } from "components/Table/TablePlaceholder";
import { onChangeHandler } from "components/Table/utils";
import { TaskLink } from "components/TasksTable/TaskLink";
import { TableQueryParams } from "constants/queryParams";
import { slugs } from "constants/routes";
import {
  VersionTaskDurationsQuery,
  SortDirection,
  TaskSortCategory,
} from "gql/generated/types";
import { useTableSort, useTaskStatuses } from "hooks";
import { useQueryParams } from "hooks/useQueryParam";
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

export const TaskDurationTable: React.FC<Props> = ({
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
    singleQueryParam: true,
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
        accessorKey: "status",
        header: "Status",
        size: 120,
        enableColumnFilter: true,
        enableSorting: true,
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        cell: ({ getValue }) => <TaskStatusBadge status={getValue()} />,
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
            original: { status },
          },
        }) => (
          <TaskDurationCell
            maxTimeTaken={column.getFacetedMinMaxValues()?.[1] ?? 0}
            status={status}
            timeTaken={getValue() as number}
          />
        ),
      },
    ],
    [statusOptions],
  );

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table: LeafyGreenTable<TaskDurationData> =
    useLeafyGreenTable<TaskDurationData>({
      columns,
      containerRef: tableContainerRef,
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
    : [];

  return {
    initialFilters,
    initialSort,
  };
};
