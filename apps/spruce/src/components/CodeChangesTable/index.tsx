import { WordBreak, StyledLink } from "@evg-ui/lib/components/styles";
import {
  useLeafyGreenTable,
  BaseTable,
  LGColumnDef,
} from "@evg-ui/lib/components/Table";
import { FileDiffText } from "components/CodeChangesBadge";
import { FileDiffsFragment } from "gql/generated/types";

interface CodeChangesTableProps {
  fileDiffs: FileDiffsFragment[];
}
export const CodeChangesTable: React.FC<CodeChangesTableProps> = ({
  fileDiffs,
}) => {
  const table = useLeafyGreenTable<FileDiffsFragment>({
    columns,
    data: fileDiffs ?? [],
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

const columns: LGColumnDef<FileDiffsFragment>[] = [
  {
    accessorKey: "fileName",
    header: "File Name",
    meta: { width: "70%" },
    cell: ({
      getValue,
      row: {
        original: { diffLink },
      },
    }) => (
      <StyledLink data-cy="fileLink" href={diffLink}>
        <WordBreak>{getValue() as string}</WordBreak>
      </StyledLink>
    ),
  },
  {
    accessorKey: "additions",
    header: "Additions",
    cell: ({ getValue }) => (
      <FileDiffText type="+" value={getValue() as number} />
    ),
  },
  {
    accessorKey: "deletions",
    header: "Deletions",
    cell: ({ getValue }) => (
      <FileDiffText type="-" value={getValue() as number} />
    ),
  },
];
