import { useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import {
  TablePlaceholder,
  LeafyGreenTable,
  RowSorting,
  SortingState,
  useLeafyGreenTable,
  BaseTable,
  onChangeHandler,
} from "@evg-ui/lib/components/Table";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { useTaskAnalytics } from "analytics";
import { getColumnsTemplate } from "components/TasksTable/Columns";
import { taskReviewStyles } from "components/TasksTable/styles";
import { TaskTableInfo } from "components/TasksTable/types";
import { DISABLE_TASK_REVIEW } from "constants/cookies";
import { TableQueryParams } from "constants/queryParams";
import {
  TaskQuery,
  TaskSortCategory,
  SortDirection,
} from "gql/generated/types";
import { useTableSort } from "hooks";
import { parseSortString } from "utils/queryString";

const { getDefaultOptions: getDefaultSorting } = RowSorting;

interface Props {
  execution: number;
  executionTasksFull: NonNullable<TaskQuery["task"]>["executionTasksFull"];
  isPatch: boolean;
}

const ExecutionTasksTable: React.FC<Props> = ({
  execution,
  executionTasksFull,
  isPatch,
}) => {
  const { sendEvent } = useTaskAnalytics();
  const taskReviewEnabled = Cookies.get(DISABLE_TASK_REVIEW) !== "true";
  const [sorts, setSorts] = useQueryParam(TableQueryParams.Sorts, "");
  // Apply default sort if no sorting method is defined.
  useEffect(() => {
    if (!sorts) {
      setSorts(defaultSortQueryParam);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const uniqueExecutions = new Set([
    execution,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    ...executionTasksFull.map((t) => t.execution),
  ]);

  const initialSorting = getInitialSorting(sorts);

  const columns = useMemo(
    () =>
      getColumnsTemplate({
        isPatch,
        onClickTaskLink: () =>
          sendEvent({ name: "Clicked execution tasks table link" }),
        showTaskExecutionLabel: uniqueExecutions.size > 1,
      }),
    [isPatch, sendEvent, uniqueExecutions.size],
  );

  const tableSortHandler = useTableSort({
    sendAnalyticsEvents: (sorter: SortingState) =>
      sendEvent({
        name: "Sorted execution tasks table",
        "sort.by": sorter.map(({ id }) => id as TaskSortCategory),
      }),
  });

  const table: LeafyGreenTable<TaskTableInfo> =
    useLeafyGreenTable<TaskTableInfo>({
      columns,
      data: executionTasksFull ?? [],
      defaultColumn: {
        enableColumnFilter: false,
        enableMultiSort: true,
      },
      initialState: {
        columnVisibility: { reviewed: taskReviewEnabled },
        sorting: initialSorting,
      },
      isMultiSortEvent: () => true, // Override default requirement for shift-click to multisort.
      maxMultiSortColCount: 2,
      onSortingChange: onChangeHandler<SortingState>(
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        (s) => getDefaultSorting(table).onSortingChange(s),
        tableSortHandler,
      ),
    });

  return (
    <BaseTable
      css={taskReviewEnabled && taskReviewStyles}
      data-cy="execution-tasks-table"
      data-cy-row="execution-tasks-table-row"
      emptyComponent={<TablePlaceholder message="No execution tasks found." />}
      shouldAlternateRowColor
      table={table}
    />
  );
};

const getInitialSorting = (sorts: string): SortingState => {
  const initialSorting = sorts
    ? parseSortString<
        "id",
        "direction",
        TaskSortCategory,
        {
          id: TaskSortCategory;
          direction: SortDirection;
        }
      >(sorts, {
        sortCategoryEnum: TaskSortCategory,
        sortByKey: "id",
        sortDirKey: "direction",
      }).map(({ direction, id }) => ({
        id,
        desc: direction === SortDirection.Desc,
      }))
    : [{ id: TaskSortCategory.Status, desc: false }];

  return initialSorting;
};

const defaultSortQueryParam = `${TaskSortCategory.Status}:${SortDirection.Asc}`;

export default ExecutionTasksTable;
