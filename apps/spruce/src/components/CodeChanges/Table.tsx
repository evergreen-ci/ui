import { WordBreak, StyledLink } from "@evg-ui/lib/components/styles";
import {
  useLeafyGreenTable,
  BaseTable,
  LGColumnDef,
} from "@evg-ui/lib/components/Table";
import { getFileDiffRoute } from "constants/routes";
import { FileDiffsFragment } from "gql/generated/types";
import { FileDiffText } from "./Badge";

interface TableProps {
  fileDiffs: FileDiffsFragment[];
  isMergeQueuePatch?: boolean;
  patchId: string;
  moduleIndex: number;
}
export const Table: React.FC<TableProps> = ({
  fileDiffs,
  isMergeQueuePatch = false,
  moduleIndex,
  patchId,
}) => {
  const table = useLeafyGreenTable<FileDiffsFragment>({
    columns: getColumns(patchId, moduleIndex, isMergeQueuePatch),
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
  isMergeQueuePatch: boolean,
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
      if (isMergeQueuePatch) {
        return (
          <span data-cy="fileLink">
            <WordBreak>{getValue() as string}</WordBreak>
          </span>
        );
      }
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
