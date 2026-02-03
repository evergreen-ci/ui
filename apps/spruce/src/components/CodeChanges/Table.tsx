import {
  WordBreak,
  StyledLink,
  useLeafyGreenTable,
  BaseTable,
  LGColumnDef,
} from "@evg-ui/lib/components";
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
  const table = useLeafyGreenTable<FileDiffsFragment>({
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

const getColumns = (
  patchId: string,
  moduleIndex: number,
): LGColumnDef<FileDiffsFragment>[] => [
  {
    accessorKey: "fileName",
    header: "File Name",
    meta: { width: "70%" },
    cell: ({
      getValue,
      row: {
        original: { fileName },
      },
    }) => {
      const fileDiffRoute = getFileDiffRoute(patchId, fileName, moduleIndex);
      return (
        <StyledLink data-cy="fileLink" href={fileDiffRoute}>
          <WordBreak>{getValue() as string}</WordBreak>
        </StyledLink>
      );
    },
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
