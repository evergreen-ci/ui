import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { Pagination } from "@leafygreen-ui/pagination";
import TestStatusBadge from "@evg-ui/lib/components/Badge/TestStatusBadge";
import Icon from "@evg-ui/lib/components/Icon";
import { WordBreak } from "@evg-ui/lib/components/styles";
import {
  BaseTable,
  ColumnFiltersState,
  filterFns,
  getFilteredRowModel,
  LGColumnDef,
  onChangeHandler,
  useLeafyGreenTable,
} from "@evg-ui/lib/components/Table";
import { size } from "@evg-ui/lib/constants/tokens";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { TestStatus } from "@evg-ui/lib/types/test";
import { useTaskHistoryAnalytics } from "analytics";
import { TaskHistoryOptions, TaskHistoryTask } from "../types";

type FailedTests = TaskHistoryTask["tests"];
type FailedTestResult = FailedTests["testResults"][number];

const DEFAULT_PAGE_SIZE = 5;

interface CommitDetailsCardProps {
  tests: FailedTests;
}

const FailedTestsTable: React.FC<CommitDetailsCardProps> = ({ tests }) => {
  const { testResults } = tests;

  const { sendEvent } = useTaskHistoryAnalytics();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [, setFailingTest] = useQueryParam<string>(
    TaskHistoryOptions.FailingTest,
    "",
  );

  const columns = useMemo(
    () =>
      getColumns({
        onClickLogs: (testName) =>
          sendEvent({
            name: "Clicked test log link",
            "test.name": testName,
          }),
        onClickSearchFailure: (testName) => {
          sendEvent({
            name: "Filtered to test failure",
            "test.name": testName,
          });
          setFailingTest(testName);
        },
      }),
    [sendEvent, setFailingTest],
  );

  const table = useLeafyGreenTable<FailedTestResult>({
    columns,
    data: testResults ?? [],
    defaultColumn: {
      enableColumnFilter: false,
      enableSorting: false,
    },
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE },
    },
    onColumnFiltersChange: onChangeHandler<ColumnFiltersState>(
      setColumnFilters,
      (f) =>
        sendEvent({
          name: "Filtered table",
          "table.filters": f,
        }),
    ),
    state: {
      columnFilters,
    },
    withPagination: true,
  });

  return (
    <TableContainer>
      <BaseTable
        data-cy="failing-tests-changes-table"
        data-cy-row="failing-tests-table-row"
        shouldAlternateRowColor
        table={table}
      />
      {testResults.length > DEFAULT_PAGE_SIZE ? (
        <Pagination
          currentPage={table.getState().pagination.pageIndex + 1}
          itemsPerPage={DEFAULT_PAGE_SIZE}
          numTotalItems={table.getFilteredRowModel().rows.length}
          onBackArrowClick={() => table.previousPage()}
          onCurrentPageOptionChange={(value: string) => {
            table.setPageIndex(Number(value) - 1);
          }}
          onForwardArrowClick={() => table.nextPage()}
        />
      ) : null}
    </TableContainer>
  );
};

export default FailedTestsTable;

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xxs};
  margin-top: ${size.xxs};
  overflow-x: auto;
`;

const getColumns = ({
  onClickLogs,
  onClickSearchFailure,
}: {
  onClickLogs: (testName: string) => void;
  onClickSearchFailure: (testName: string) => void;
}): LGColumnDef<FailedTestResult>[] => [
  {
    accessorKey: "testFile",
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
    enableColumnFilter: true,
    filterFn: filterFns.includesString,
    header: "Test Failure Name",
    meta: {
      search: {
        "data-cy": "test-name-filter",
        placeholder: "Test name",
      },
      width: "60%",
    },
  },
  {
    accessorKey: "status",
    cell: ({ getValue }) => (
      <TestStatusBadge status={getValue() as TestStatus} />
    ),
    header: "Failure Type",
    meta: { width: "80px" },
  },
  {
    cell: ({
      row: {
        original: {
          logs: { urlParsley },
          testFile,
        },
      },
    }) => (
      <ButtonContainer>
        <StyledButton
          onClick={() => onClickSearchFailure(testFile)}
          size={ButtonSize.XSmall}
        >
          Search Failure
        </StyledButton>
        {urlParsley && (
          <StyledButton
            href={urlParsley}
            onClick={() => onClickLogs(testFile)}
            rightGlyph={<Icon glyph="OpenNewTab" />}
            size={ButtonSize.XSmall}
            target="__blank"
            title="Parsley logs"
          >
            Logs
          </StyledButton>
        )}
      </ButtonContainer>
    ),
    header: "Actions",
  },
];

const ButtonContainer = styled.div`
  display: flex;
  gap: ${size.xs};
`;

const StyledButton = styled(Button)`
  flex-shrink: 0;
`;
