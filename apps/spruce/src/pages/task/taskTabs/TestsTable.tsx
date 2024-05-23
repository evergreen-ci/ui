import { useEffect, useMemo, useRef } from "react";
import { useQuery } from "@apollo/client";
import {
  ColumnFiltering,
  ColumnFiltersState,
  RowSorting,
  SortingState,
  useLeafyGreenTable,
} from "@leafygreen-ui/table";
import { useLocation } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import { BaseTable } from "components/Table/BaseTable";
import TableControl from "components/Table/TableControl";
import TableWrapper from "components/Table/TableWrapper";
import { onChangeHandler } from "components/Table/utils";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { TableQueryParams } from "constants/queryParams";
import {
  TaskTestsQuery,
  TaskTestsQueryVariables,
  SortDirection,
  TestSortCategory,
  TestResult,
  TaskQuery,
} from "gql/generated/types";
import { TASK_TESTS } from "gql/queries";
import { useTableSort, usePolling } from "hooks";
import usePagination from "hooks/usePagination";
import { useQueryParams } from "hooks/useQueryParam";
import { RequiredQueryParams } from "types/task";
import { TestStatus } from "types/test";
import { queryString } from "utils";
import { ParsedQueryStringValue, toSortString } from "utils/queryString";
import { getColumnsTemplate } from "./testsTable/getColumnsTemplate";

const { parseSortString } = queryString;
const { getDefaultOptions: getDefaultFiltering } = ColumnFiltering;
const { getDefaultOptions: getDefaultSorting } = RowSorting;

interface TestsTableProps {
  task: TaskQuery["task"];
}

export const TestsTable: React.FC<TestsTableProps> = ({ task }) => {
  const { pathname } = useLocation();
  const { sendEvent } = useTaskAnalytics();

  const [queryParams, setQueryParams] = useQueryParams();
  const queryVariables = useTestsTableQueryVariables(
    queryParams,
    task.id,
    task.execution,
  );
  const { limitNum, pageNum, sort } = queryVariables;

  const appliedDefaultSort = useRef(false);
  useEffect(() => {
    if (!appliedDefaultSort.current) {
      // Avoid race condition where this hook overwrites TaskTabs setting a default execution.
      if (task.execution == null) {
        return;
      }
      if (sort.length === 0 && appliedDefaultSort.current === null) {
        setQueryParams({
          ...queryParams,
          [TableQueryParams.Sorts]: toSortString(
            [{ sortBy: TestSortCategory.Status, direction: SortDirection.Asc }],
            "sortBy",
          ),
        });
      }
      appliedDefaultSort.current = true;
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data, loading, refetch, startPolling, stopPolling } = useQuery<
    TaskTestsQuery,
    TaskTestsQueryVariables
  >(TASK_TESTS, {
    variables: queryVariables,
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  usePolling({ startPolling, stopPolling, refetch });

  const clearQueryParams = () => {
    table.resetColumnFilters(true);
  };

  const updateFilters = (filterState: ColumnFiltersState) => {
    const updatedParams = {
      ...queryParams,
      page: 0,
      ...emptyFilterQueryParams,
    };

    filterState.forEach(({ id, value }) => {
      const key = mapIdToFilterParam[id];
      updatedParams[key] = value;
    });

    setQueryParams(updatedParams);
    sendEvent({ name: "Filter Tests", filterBy: Object.keys(filterState) });
  };

  const tableSortHandler = useTableSort({
    sendAnalyticsEvents: (sorter: SortingState) =>
      sendEvent({
        name: "Sort Tests Table",
        sortBy: sorter.map(({ id }) => id as TestSortCategory),
      }),
  });

  const { task: taskData } = data ?? {};
  const { tests } = taskData ?? {};
  const { filteredTestCount, testResults, totalTestCount } = tests ?? {};

  const { initialFilters, initialSorting } = useMemo(
    () => getInitialState(queryParams),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const setSorting = (s: SortingState) =>
    getDefaultSorting(table).onSortingChange(s);

  const setFilters = (f: ColumnFiltersState) =>
    getDefaultFiltering(table).onColumnFiltersChange(f);

  const columns = useMemo(() => getColumnsTemplate({ task }), [task]);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<TestResult>({
    columns,
    containerRef: tableContainerRef,
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
      columnFilters: initialFilters,
      sorting: initialSorting,
    },
    // Override default requirement for shift-click to multisort.
    isMultiSortEvent: () => true,
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    maxMultiSortColCount: 2,
    onColumnFiltersChange: onChangeHandler<ColumnFiltersState>(
      setFilters,
      updateFilters,
    ),
    onSortingChange: onChangeHandler<SortingState>(
      setSorting,
      tableSortHandler,
    ),
  });

  return (
    <TableWrapper
      controls={
        <TableControl
          filteredCount={filteredTestCount}
          totalCount={totalTestCount}
          limit={limitNum}
          page={pageNum}
          label="tests"
          onClear={clearQueryParams}
          onPageSizeChange={() => {
            sendEvent({ name: "Change Page Size" });
          }}
        />
      }
      shouldShowBottomTableControl={filteredTestCount > 10}
    >
      <BaseTable
        data-cy="tests-table"
        data-loading={loading}
        loading={loading}
        loadingRows={limitNum}
        shouldAlternateRowColor
        table={table}
      />
    </TableWrapper>
  );
};

const emptyFilterQueryParams = {
  [RequiredQueryParams.TestName]: undefined,
  [RequiredQueryParams.Statuses]: undefined,
};

const getInitialState = (
  queryParams: ParsedQueryStringValue,
): {
  initialFilters: ColumnFiltersState;
  initialSorting: SortingState;
} => {
  const { [TableQueryParams.Sorts]: sortBy } = queryParams;

  const parsedSort = parseSortString(sortBy as string, "id");

  const initialSort = parsedSort.map(({ direction, id }) => ({
    id,
    desc: direction === SortDirection.Desc,
  }));
  const initialFilters = Object.entries(mapFilterParamToId).reduce(
    (accum, [param, id]) => {
      if (typeof queryParams[param] === "string") {
        return [...accum, { id, value: queryParams[param] }];
      }
      return accum;
    },
    [],
  );
  return {
    initialSorting: initialSort || [
      { id: TestSortCategory.Status, desc: false },
    ],
    initialFilters,
  };
};

const useTestsTableQueryVariables = (
  queryParams: ParsedQueryStringValue,
  taskId: string,
  execution: number,
) => {
  const { limit, page } = usePagination();
  // Determining sort category

  const sort = parseSortString(
    queryParams[TableQueryParams.Sorts] as string,
    "sortBy",
  );

  const testName = (queryParams[RequiredQueryParams.TestName] as string) || "";
  const rawStatuses = queryParams[RequiredQueryParams.Statuses] as string;

  const statusList = (
    Array.isArray(rawStatuses) ? rawStatuses : [rawStatuses]
  ).filter((v) => v && v !== TestStatus.All);

  return {
    id: taskId,
    sort,
    limitNum: limit,
    statusList,
    execution,
    testName,
    pageNum: page,
  } satisfies TaskTestsQueryVariables;
};

const mapFilterParamToId = {
  [RequiredQueryParams.Statuses]: TestSortCategory.Status,
  [RequiredQueryParams.TestName]: TestSortCategory.TestName,
} as const;

const mapIdToFilterParam = Object.entries(mapFilterParamToId).reduce(
  (accum, [id, param]) => ({
    ...accum,
    [param]: id,
  }),
  {},
);
