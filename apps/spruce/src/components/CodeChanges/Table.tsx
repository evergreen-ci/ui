import { useMemo } from "react";
import styled from "@emotion/styled";
import { LGColumnDef } from "@leafygreen-ui/table";
import { WordBreak } from "@evg-ui/lib/components/styles";
import {
  useLeafyGreenTable,
  BaseTable,
  LeafyGreenTableRow,
} from "@evg-ui/lib/components/Table";
import { FileDiffsFragment } from "gql/generated/types";
import { FileDiffText } from "./Badge";
import { Diff } from "./Diff";

interface CodeChangesTableProps {
  fileDiffs: FileDiffsFragment[];
}
export const CodeChangesTable: React.FC<CodeChangesTableProps> = ({
  fileDiffs,
}) => {
  const fileData = useMemo(
    () =>
      fileDiffs.map((diff) => ({
        ...diff,
        renderExpandedContent: (row: LeafyGreenTableRow<FileDiffsFragment>) => (
          <Diff diff={row.original.diff} />
        ),
      })),
    [fileDiffs],
  );
  const table = useLeafyGreenTable({
    columns,
    data: fileData ?? [],
    enableColumnFilters: false,
    enableSorting: false,
  });

  return (
    <Container>
      <StyledTable
        data-cy="code-changes-table"
        data-cy-row="code-changes-table-row"
        shouldAlternateRowColor
        table={table}
      />
    </Container>
  );
};

const StyledTable = styled(BaseTable)`
  max-width: 100% !important;
  table-layout: fixed !important;
`;

const columns: LGColumnDef<FileDiffsFragment>[] = [
  {
    accessorKey: "fileName",
    header: "File Name",
    meta: { width: "70%" },
    cell: ({
      getValue,
      // @ts-expect-error - getValue is untyped
    }) => <WordBreak>{getValue()}</WordBreak>,
  },
  {
    accessorKey: "additions",
    header: "Additions",
    // @ts-expect-error - getValue is untyped
    cell: ({ getValue }) => <FileDiffText type="+" value={getValue()} />,
  },
  {
    accessorKey: "deletions",
    header: "Deletions",
    // @ts-expect-error - getValue is untyped
    cell: ({ getValue }) => <FileDiffText type="-" value={getValue()} />,
  },
];

const Container = styled.div`
  table {
    table-layout: fixed;
  }
`;
