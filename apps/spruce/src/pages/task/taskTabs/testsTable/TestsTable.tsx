import { useEffect, useMemo, useRef, useState } from "react";
import { skipToken, useQuery } from "@apollo/client/react";
import { useLocation } from "react-router-dom";
import {
  BaseTable,
  ColumnFiltersState,
  LeafyGreenTable,
  onChangeHandler,
  SortingState,
  TableControl,
  TableWrapper,
  useLeafyGreenTable,
} from "@evg-ui/lib/components/Table";
import { ALL_VALUE } from "@evg-ui/lib/components/TreeSelect";
import { PaginationQueryParams } from "@evg-ui/lib/constants/pagination";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { useTaskAnalytics } from "analytics";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { TableQueryParams } from "constants/queryParams";
import {
  SortDirection,
  TaskQuery,
  TaskTestsQuery,
  TaskTestsQueryVariables,
  TestResult,
  TestSortCategory,
  TestSortOptions,
} from "gql/generated/types";
import { TASK_TESTS } from "gql/queries";
import { usePolling, useTableSort } from "hooks";
import {
  mapFilterParamToId,
  mapIdToFilterParam,
  RequiredQueryParams,
} from "types/task";
import { queryString } from "utils";
import { getColumnsTemplate } from "./getColumnsTemplate";

const { getLimit, getPage, getString, parseSortString, queryParamAsNumber } =
  queryString;

interface TestsTableProps {
  task: NonNullable<TaskQuery["task"]>;
}

const TestsTable: React.FC<TestsTableProps> = ({ task }) => {
  const { pathname } = useLocation();
  const { sendEvent } = useTaskAnalytics();

  const [queryParams, setQueryParams] = useQueryParams();
  const queryVariables = getQueryVariables(queryParams, task.id);
  const { execution, limitNum, pageNum, sort } = queryVariables;
  const sortBy = sort?.[0]?.sortBy;

  const appliedDefaultSort = useRef(null);
  useEffect(() => {
    // Avoid race condition where this hook overwrites TaskTabs setting a default execution.
    if (execution == null) {
      return;
    }
    if (sortBy === undefined && appliedDefaultSort.current !== pathname) {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      appliedDefaultSort.current = pathname;
      setQueryParams({
        ...queryParams,
        [TableQueryParams.Sorts]: `${TestSortCategory.Status}:${SortDirection.Asc}`,
      });
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data, loading, refetch, startPolling, stopPolling } = useQuery<
    TaskTestsQuery,
    TaskTestsQueryVariables
  >(
    TASK_TESTS,
    queryVariables.execution !== null
      ? {
          pollInterval: DEFAULT_POLL_INTERVAL,
          variables: queryVariables,
        }
      : skipToken,
  );
  usePolling<TaskTestsQuery, TaskTestsQueryVariables>({
    refetch,
    startPolling,
    stopPolling,
  });

  const clearQueryParams = () => {
    table.resetColumnFilters(true);
  };

  const { initialFilters, initialSorting } = getInitialState(queryParams);

  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialFilters);

  const [sorting, setSorting] = useState<SortingState>(initialSorting);

  const updateFilters = (filterState: ColumnFiltersState) => {
    const updatedParams: Record<string, unknown> = {
      ...queryParams,
      page: "0",
      ...emptyFilterQueryParams,
    };
    filterState.forEach(({ id, value }) => {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      const key = mapIdToFilterParam[id];
      updatedParams[key] = value;
    });
    setQueryParams(updatedParams);
    sendEvent({
      "filter.by": Object.keys(filterState),
      name: "Filtered tests table",
    });
  };

  const tableSortHandler = useTableSort({
    sendAnalyticsEvents: (sorter: SortingState) =>
      sendEvent({
        name: "Sorted tests table",
        "sort.by": sorter.map(({ id }) => id as TestSortCategory),
      }),
  });

  const { task: taskData } = data ?? {};
  const { tests } = taskData ?? {};
  const {
    filteredTestCount = 0,
    testResults,
    totalTestCount = 0,
  } = tests ?? {};
  const isLoading = !testResults && loading; // TODO: Re-evaluate in DEVPROD-33191.

  const columns = useMemo(
    () =>
      getColumnsTemplate({
        task,
      }),
    [task],
  );

  const table: LeafyGreenTable<TestResult> = useLeafyGreenTable<TestResult>({
    columns,
    data: testResults ?? [],
    defaultColumn: {
      enableColumnFilter: false,
      enableMultiSort: true,
      enableSorting: false,
      size: "auto" as unknown as number,
      // Handle bug in sorting order
      // https://github.com/TanStack/table/issues/4289
      sortDescFirst: false,
    },
    initialState: {
      columnVisibility: {
        actions: task.project?.testSelection?.allowed ?? false,
      },
    },
    // Override default requirement for shift-click to multisort.
    isMultiSortEvent: () => true,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    maxMultiSortColCount: 2,
    onColumnFiltersChange: onChangeHandler<ColumnFiltersState>(
      setColumnFilters,
      updateFilters,
    ),
    onSortingChange: onChangeHandler<SortingState>(
      setSorting,
      tableSortHandler,
    ),
    state: {
      columnFilters,
      sorting,
    },
  });

  return (
    <TableWrapper
      controls={
        <TableControl
          filteredCount={filteredTestCount}
          label="tests"
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          limit={limitNum}
          onClear={clearQueryParams}
          onPageSizeChange={() => {
            sendEvent({ name: "Changed page size" });
          }}
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          page={pageNum}
          totalCount={totalTestCount}
        />
      }
      shouldShowBottomTableControl={filteredTestCount > 10}
    >
      <BaseTable
        data-cy="tests-table"
        data-loading={isLoading}
        loading={isLoading}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        loadingRows={limitNum}
        shouldAlternateRowColor
        table={table}
      />
    </TableWrapper>
  );
};

const emptyFilterQueryParams = {
  [RequiredQueryParams.Statuses]: undefined,
  [RequiredQueryParams.TestName]: undefined,
};

const getInitialState = (queryParams: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}): {
  initialFilters: ColumnFiltersState;
  initialSorting: SortingState;
} => {
  const { [TableQueryParams.Sorts]: sorts } = queryParams;

  const initialSorting: SortingState = sorts
    ? parseSortString(sorts, {
        sortByKey: "sortBy",
        sortCategoryEnum: TestSortCategory,
        sortDirKey: "direction",
      }).map(({ direction, sortBy }) => ({
        desc: direction === SortDirection.Desc,
        id: sortBy,
      }))
    : [{ desc: false, id: TestSortCategory.Status }];

  return {
    initialFilters: Object.entries(mapFilterParamToId).reduce(
      (accum, [param, id]) => {
        if (queryParams[param]?.length) {
          return [...accum, { id, value: queryParams[param] }];
        }
        return accum;
      },
      [] as ColumnFiltersState,
    ),
    initialSorting,
  };
};

const getQueryVariables = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryParams: { [key: string]: any },
  taskId: string,
): TaskTestsQueryVariables => {
  const sorts = queryParams[TableQueryParams.Sorts];

  let sort: TestSortOptions[] = [];
  if (sorts) {
    sort = parseSortString<
      "sortBy",
      "direction",
      TestSortCategory,
      TestSortOptions
    >(sorts, {
      sortByKey: "sortBy",
      sortCategoryEnum: TestSortCategory,
      sortDirKey: "direction",
    });
  }

  const testName = getString(queryParams[RequiredQueryParams.TestName]);
  const rawStatuses = queryParams[RequiredQueryParams.Statuses];
  const statusList = (
    Array.isArray(rawStatuses) ? rawStatuses : [rawStatuses]
  ).filter((v): v is string => !!v && v !== ALL_VALUE);
  const execution = queryParams[RequiredQueryParams.Execution];
  return {
    execution: queryParamAsNumber(execution),
    id: taskId,
    limitNum: getLimit(queryParams[PaginationQueryParams.Limit]),
    pageNum: getPage(queryParams[PaginationQueryParams.Page]),
    sort,
    statusList,
    testName,
  };
};

export default TestsTable;
