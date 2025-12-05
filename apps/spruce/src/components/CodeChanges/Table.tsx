import { WordBreak, StyledLink } from "@evg-ui/lib/components/styles";
import { useLeafyGreenTable, BaseTable } from "@evg-ui/lib/components/Table";
import { getFileDiffRoute } from "constants/routes";
import { FileDiffsFragment } from "gql/generated/types";
import { FileDiffText } from "./Badge";

interface TableProps {
  fileDiffs: FileDiffsFragment[];
  patchId: string;
  moduleIndex: number;
}
export const Table: React.FC<TableProps> = ({
  fileDiffs,
  moduleIndex,
  patchId,
}) => {
  const table = useLeafyGreenTable({
    columns: getColumns(patchId, moduleIndex),
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

const getColumns = (patchId: string, moduleIndex: number) => [
  {
    accessorKey: "fileName",
    header: "File Name",
    meta: { width: "70%" },
    cell: ({
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      getValue,
      row: {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        original: { fileName },
      },
    }) => {
      const fileDiffRoute = getFileDiffRoute(patchId, fileName, moduleIndex);
      return (
        <StyledLink data-cy="fileLink" href={fileDiffRoute}>
          <WordBreak>{getValue()}</WordBreak>
        </StyledLink>
      );
    },
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
