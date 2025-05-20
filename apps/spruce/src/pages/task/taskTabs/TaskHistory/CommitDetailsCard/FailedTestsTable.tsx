import { useState } from "react";
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
import { BaseTable } from "components/Table/BaseTable";
import { TaskTestResult, TestResult } from "gql/generated/types";

interface CommitDetailsCardProps {
  tests: Omit<TaskTestResult, "filteredTestCount" | "totalTestCount">;
}

const FailedTestsTable: React.FC<CommitDetailsCardProps> = ({ tests }) => {
  const { testResults } = tests;

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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

const columns: LGColumnDef<TestResult>[] = [
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
        },
      },
    }) => (
      <ButtonContainer>
        {urlParsley && (
          <StyledButton
            href={urlParsley}
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
