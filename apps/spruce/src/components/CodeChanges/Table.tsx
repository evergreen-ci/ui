import { WordBreak, StyledLink } from "@evg-ui/lib/components/styles";
import {
  useLeafyGreenTable,
  BaseTable,
  LGColumnDef,
} from "@evg-ui/lib/components/Table";
import { useVersionAnalytics } from "analytics";
import { getFileDiffRoute } from "constants/routes";
import { FileDiffsFragment } from "gql/generated/types";
import { FileDiffText } from "./Badge";

interface TableProps {
  disableDiffLinks?: boolean;
  fileDiffs: FileDiffsFragment[];
  patchId: string;
  moduleIndex: number;
}
export const Table: React.FC<TableProps> = ({
  disableDiffLinks = false,
  fileDiffs,
  moduleIndex,
  patchId,
}) => {
  const { sendEvent } = useVersionAnalytics(patchId);
  const table = useLeafyGreenTable<FileDiffsFragment>({
    columns: getColumns({ patchId, moduleIndex, disableDiffLinks, sendEvent }),
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

const getColumns = ({
  disableDiffLinks,
  moduleIndex,
  patchId,
  sendEvent,
}: {
  patchId: string;
  moduleIndex: number;
  disableDiffLinks: boolean;
  sendEvent: ReturnType<typeof useVersionAnalytics>["sendEvent"];
}): LGColumnDef<FileDiffsFragment>[] => [
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
      if (disableDiffLinks) {
        return (
          <span data-cy="file-link">
            <WordBreak>{getValue() as string}</WordBreak>
          </span>
        );
      }
      const fileDiffRoute = getFileDiffRoute(patchId, fileName, moduleIndex);
      return (
        <StyledLink
          data-cy="file-link"
          href={fileDiffRoute}
          onClick={() =>
            sendEvent({
              name: "Clicked code changes diff link",
              "diff.type": "file",
            })
          }
        >
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
