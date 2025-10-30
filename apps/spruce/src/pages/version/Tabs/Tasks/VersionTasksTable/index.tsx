import { useMemo, useState } from "react";
import Cookies from "js-cookie";
import {
  useLeafyGreenTable,
  LeafyGreenTable,
  ColumnFiltersState,
  SortingState,
  BaseTable,
  TableWrapper,
  onChangeHandler,
  TableControl,
  TablePlaceholder,
} from "@evg-ui/lib/components/Table";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { useVersionAnalytics } from "analytics";
import { getColumnsTemplate } from "components/TasksTable/Columns";
import { taskReviewStyles } from "components/TasksTable/styles";
import { TaskTableInfo } from "components/TasksTable/types";
import { DISABLE_TASK_REVIEW } from "constants/cookies";
import { TableQueryParams } from "constants/queryParams";
import { TaskSortCategory, SortDirection } from "gql/generated/types";
import { useTaskStatuses, useTableSort } from "hooks";
import { PatchTasksQueryParams } from "types/task";
import { parseSortString } from "utils/queryString";
import {
  mapIdToFilterParam,
  emptyFilterQueryParams,
  defaultSorting,
} from "./constants";

// Create a more specific enum because duration is not a valid category to sort / filter by in the tasks table.
enum VersionTaskCategory {
  BaseStatus = TaskSortCategory.BaseStatus,
  Name = TaskSortCategory.Name,
  Status = TaskSortCategory.Status,
  Variant = TaskSortCategory.Variant,
}

interface VersionTasksTableProps {
  clearQueryParams: () => void;
  filteredCount: number;
  isPatch: boolean;
  limit: number;
  loading: boolean;
  page: number;
  tasks: TaskTableInfo[];
  totalCount: number;
  versionId: string;
}

export const VersionTasksTable: React.FC<VersionTasksTableProps> = ({
  clearQueryParams,
  filteredCount,
  isPatch,
  limit,
  loading,
  page,
  tasks,
  totalCount,
  versionId,
}) => {
  const [queryParams, setQueryParams] = useQueryParams();
  const { sendEvent } = useVersionAnalytics(versionId);
  const taskReviewEnabled = Cookies.get(DISABLE_TASK_REVIEW) !== "true";

  const { baseStatuses: baseStatusOptions, currentStatuses: statusOptions } =
    useTaskStatuses({ versionId });

  const { initialFilters, initialSorting } = getInitialState(queryParams);

  const columns = useMemo(
    () =>
      getColumnsTemplate({
        baseStatusOptions,
        statusOptions,
        isPatch,
        loading,
        onClickTaskLink: (taskId: string) =>
          sendEvent({
            name: "Clicked task table task link",
            "task.id": taskId,
          }),
      }),
    [baseStatusOptions, statusOptions, isPatch, sendEvent, loading],
  );

  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialFilters);

  const [sorting, setSorting] = useState<SortingState>(initialSorting);

  const updateFilters = (filterState: ColumnFiltersState) => {
    const updatedParams: Record<string, any> = {
      ...queryParams,
      page: "0",
      ...emptyFilterQueryParams,
    };
    filterState.forEach(({ id, value }) => {
      const key = mapIdToFilterParam[id as VersionTaskCategory];
      updatedParams[key] = value;
    });
    setQueryParams(updatedParams);
    sendEvent({
      name: "Filtered tasks table",
      "filter.by": Object.keys(filterState),
    });
  };

  const updateSorting = useTableSort({
    sendAnalyticsEvents: (sorter: SortingState) =>
      sendEvent({
        name: "Sorted tasks table",
        "sort.by": sorter.map(({ id }) => id as TaskSortCategory),
      }),
  });

  const table: LeafyGreenTable<TaskTableInfo> =
    useLeafyGreenTable<TaskTableInfo>({
      columns,
      data: tasks ?? [],
      defaultColumn: {
        enableMultiSort: true,
        // Handle bug in sorting order (https://github.com/TanStack/table/issues/4289)
        sortDescFirst: false,
      },
      getRowId: (originalRow) => originalRow.id,
      initialState: {
        columnVisibility: { reviewed: taskReviewEnabled },
      },
      isMultiSortEvent: () => true, // Override default requirement for shift-click to multisort.
      state: {
        columnFilters,
        sorting,
      },
      maxMultiSortColCount: 2,
      manualFiltering: true,
      manualPagination: true,
      manualSorting: true,
      onColumnFiltersChange: onChangeHandler<ColumnFiltersState>(
        setColumnFilters,
        (updatedState) => updateFilters(updatedState),
      ),
      onSortingChange: onChangeHandler<SortingState>(setSorting, updateSorting),
      getSubRows: (row) => row.executionTasksFull || [],
    });

  return (
    <TableWrapper
      controls={
        <TableControl
          filteredCount={filteredCount}
          label="tasks"
          limit={limit}
          onClear={() => {
            setColumnFilters([]);
            setSorting(defaultSorting);
            clearQueryParams();
          }}
          onPageSizeChange={(size: number) =>
            sendEvent({ name: "Changed page size", "page.size": size })
          }
          page={page}
          totalCount={totalCount}
        />
      }
      shouldShowBottomTableControl={limit > 10}
    >
      <BaseTable
        css={taskReviewEnabled && taskReviewStyles}
        data-cy="tasks-table"
        data-cy-row="tasks-table-row"
        data-loading={loading}
        emptyComponent={<TablePlaceholder message="No tasks found." />}
        loading={loading}
        loadingRows={limit}
        shouldAlternateRowColor
        table={table}
      />
    </TableWrapper>
  );
};

export const getInitialState = (
  queryParams: Record<string, any>,
): {
  initialFilters: ColumnFiltersState;
  initialSorting: SortingState;
} => {
  const {
    [PatchTasksQueryParams.TaskName]: taskName,
    [PatchTasksQueryParams.Statuses]: statuses,
    [PatchTasksQueryParams.BaseStatuses]: baseStatuses,
    [PatchTasksQueryParams.Variant]: variant,
    [TableQueryParams.Sorts]: sorts,
  } = queryParams;

  const initialFilters = [];

  if (taskName) {
    initialFilters.push({
      id: VersionTaskCategory.Name,
      value: taskName,
    });
  }
  if (statuses) {
    initialFilters.push({
      id: VersionTaskCategory.Status,
      value: Array.isArray(statuses) ? statuses : [statuses],
    });
  }
  if (baseStatuses) {
    initialFilters.push({
      id: VersionTaskCategory.BaseStatus,
      value: Array.isArray(baseStatuses) ? baseStatuses : [baseStatuses],
    });
  }
  if (variant) {
    initialFilters.push({ id: VersionTaskCategory.Variant, value: variant });
  }

  const parsedSorts = sorts
    ? parseSortString(sorts, {
        sortByKey: "sortCategory",
        sortDirKey: "direction",
        sortCategoryEnum: VersionTaskCategory,
      })
    : [];

  return {
    initialSorting: parsedSorts.length
      ? parsedSorts.map(({ direction, sortCategory }) => ({
          id: sortCategory,
          desc: direction === SortDirection.Desc,
        }))
      : defaultSorting,
    initialFilters,
  };
};
