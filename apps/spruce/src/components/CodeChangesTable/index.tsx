import { useRef } from "react";
import { useLeafyGreenTable } from "@leafygreen-ui/table";
import { WordBreak, StyledLink } from "@evg-ui/lib/components/styles";
import { FileDiffText } from "components/CodeChangesBadge";
import { BaseTable } from "components/Table/BaseTable";
import { FileDiffsFragment } from "gql/generated/types";

interface CodeChangesTableProps {
  fileDiffs: FileDiffsFragment[];
}
export const CodeChangesTable: React.FC<CodeChangesTableProps> = ({
  fileDiffs,
}) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable({
    columns,
    data: fileDiffs ?? [],
    containerRef: tableContainerRef,
    enableColumnFilters: false,
    enableSorting: false,
  });

  return (
    <BaseTable
      data-cy="code-changes-table"
      data-cy-row="code-changes-table-row"
      shouldAlternateRowColor
      table={table}
    />
  );
};

const columns = [
  {
    accessorKey: "fileName",
    header: "File Name",
    meta: { width: "70%" },
    cell: ({
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      getValue,
      row: {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        original: { diffLink },
      },
    }) => (
      <StyledLink
        data-cy="fileLink"
        href={diffLink}
        rel="noopener noreferrer"
        target="_blank"
      >
        <WordBreak>{getValue()}</WordBreak>
      </StyledLink>
    ),
  },
  {
    accessorKey: "additions",
    header: "Additions",
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    cell: ({ getValue }) => <FileDiffText type="+" value={getValue()} />,
  },
  {
    accessorKey: "deletions",
    header: "Deletions",
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    cell: ({ getValue }) => <FileDiffText type="-" value={getValue()} />,
  },
];
