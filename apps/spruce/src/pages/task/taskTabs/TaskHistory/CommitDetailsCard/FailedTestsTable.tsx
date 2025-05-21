import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import Button, { Size as ButtonSize } from "@leafygreen-ui/button";
import {
  ColumnFiltersState,
  LGColumnDef,
  useLeafyGreenTable,
} from "@leafygreen-ui/table";
import TestStatusBadge from "@evg-ui/lib/components/Badge/TestStatusBadge";
import Icon from "@evg-ui/lib/components/Icon";
import { WordBreak } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { TestStatus } from "@evg-ui/lib/types/test";
import { useTaskHistoryAnalytics } from "analytics";
import { BaseTable } from "components/Table/BaseTable";
import { TaskTestResult, TestResult } from "gql/generated/types";
import { useQueryParam } from "hooks/useQueryParam";
import { TaskHistoryOptions } from "../types";

interface CommitDetailsCardProps {
  tests: Omit<TaskTestResult, "filteredTestCount" | "totalTestCount">;
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
        setFailingTest,
      }),
    [sendEvent, setFailingTest],
  );

  const table = useLeafyGreenTable<TestResult>({
    columns,
    data: testResults ?? [],
    defaultColumn: {
      enableColumnFilter: false,
      enableSorting: false,
    },
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
  });

  return (
    <BaseTable
      data-cy="failing-tests-changes-table"
      data-cy-row="failing-tests-table-row"
      shouldAlternateRowColor
      table={table}
    />
  );
};

export default FailedTestsTable;

const getColumns = ({
  onClickLogs,
  setFailingTest,
}: {
  onClickLogs: (testName: string) => void;
  setFailingTest: (testName: string) => void;
}): LGColumnDef<TestResult>[] => [
  {
    accessorKey: "testFile",
    header: "Test Failure Name",
    meta: { width: "60%" },
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
  },
  {
    accessorKey: "status",
    header: "Failure Type",
    meta: { width: "80px" },
    cell: ({ getValue }) => (
      <TestStatusBadge status={getValue() as TestStatus} />
    ),
  },
  {
    header: "Actions",
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
          onClick={() => setFailingTest(testFile)}
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
  },
];

const ButtonContainer = styled.div`
  display: flex;
  gap: ${size.xs};
`;

const StyledButton = styled(Button)`
  flex-shrink: 0;
`;
