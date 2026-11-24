import { useMemo } from "react";
import styled from "@emotion/styled";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { Align, Justify, Tooltip } from "@leafygreen-ui/tooltip";
import { Subtitle } from "@leafygreen-ui/typography";
import {
  TableSlot,
  UseTableDetailsOptions,
  useTableDetails,
} from "@via-ds/components/table";
import { ToggleButton } from "@via-ds/components/toggle-button";
import { Size } from "@via-ds/components/types";
import Note from "@via-ds/icons/Note";
import { StyledLink } from "@evg-ui/lib/components/styles";
import {
  ViaBaseTable,
  ViaColumnDef,
  useTable,
} from "@evg-ui/lib/components/Table";
import { size } from "@evg-ui/lib/constants/tokens";
import { useTaskAnalytics } from "analytics";
import {
  AssociatedLinks,
  processFilesWithAssociatedLinks,
} from "./AssociatedLinks";
import { FileTableRow, GroupedFilesFile } from "./types";

const getColumns = (
  taskAnalytics: ReturnType<typeof useTaskAnalytics>,
  hasAssociatedLinks: boolean,
): ViaColumnDef<FileTableRow>[] => [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
    meta: {
      width: "90%",
    },
    cell: (value) => {
      const { link, name: fileName, urlParsley } = value.row.original;
      if (link === null) {
        return fileName;
      }
      return (
        <StyledLink
          data-testid="file-link"
          href={link}
          onClick={() => {
            taskAnalytics.sendEvent({
              name: "Clicked task file link",
              "parsley.is_available": urlParsley !== null,
              "file.name": fileName,
            });
          }}
        >
          {fileName}
        </StyledLink>
      );
    },
  },
  {
    accessorKey: "urlParsley",
    header: "",
    enableSorting: false,
    cell: (value) => {
      const row = value.row.original;
      return (
        <Tooltip
          align={Align.Top}
          enabled={row.urlParsley === null}
          justify={Justify.Middle}
          trigger={
            <Button
              data-testid="parsley-link"
              disabled={row.urlParsley === null}
              href={row.urlParsley ?? undefined}
              onClick={() => {
                taskAnalytics.sendEvent({
                  name: "Clicked task file Parsley link",
                  "file.name": row.name,
                });
              }}
              size={ButtonSize.Small}
            >
              Parsley
            </Button>
          }
        >
          Only plain text files can be opened in Parsley.
        </Tooltip>
      );
    },
  },
  ...(hasAssociatedLinks
    ? [
        {
          id: "details",
          header: "Details",
          enableSorting: false,
          cell: ({ row }) =>
            row.original.associatedLinks.length > 0 && (
              <ToggleButton
                data-testid="associated-links-toggle"
                size={Size.Small}
                slot={TableSlot.PanelToggle}
              >
                <Note slot="icon" />
              </ToggleButton>
            ),
        } satisfies ViaColumnDef<FileTableRow>,
      ]
    : []),
];

const getTableDetailsOptions = (
  taskAnalytics: ReturnType<typeof useTaskAnalytics>,
  taskName?: string,
): UseTableDetailsOptions<FileTableRow> => ({
  id: `task-files-${taskName}`,
  getRowLabel: (row) => row.original.name,
  render: (details) => (
    <AssociatedLinks
      {...details}
      onLinkPress={(fileName, linkName) =>
        taskAnalytics.sendEvent({
          name: "Clicked task file associated link",
          "file.name": fileName,
          "link.name": linkName,
        })
      }
    />
  ),
});

interface GroupedFileTableProps {
  files: GroupedFilesFile[];
  taskName?: string;
}

const GroupedFileTable: React.FC<GroupedFileTableProps> = ({
  files,
  taskName,
}) => {
  const taskAnalytics = useTaskAnalytics();

  const tableData = useMemo(
    () => processFilesWithAssociatedLinks(files),
    [files],
  );

  const hasAssociatedLinks = tableData.some(
    ({ associatedLinks }) => associatedLinks.length > 0,
  );

  const memoizedColumns = useMemo(
    () => getColumns(taskAnalytics, hasAssociatedLinks),
    [taskAnalytics, hasAssociatedLinks],
  );

  const table = useTable<FileTableRow>({
    data: tableData,
    columns: memoizedColumns,
    defaultColumn: {
      enableColumnFilter: false,
    },
    getRowId: ({ link, name }) => `${name}-${link}`,
  });

  useTableDetails(table, getTableDetailsOptions(taskAnalytics, taskName));

  return (
    <Container>
      {taskName && <Subtitle>{taskName}</Subtitle>}
      <ViaBaseTable
        data-testid="files-table"
        shouldAlternateRowColor
        table={table}
      />
    </Container>
  );
};

const Container = styled.div`
  margin-bottom: ${size.m};
`;

export default GroupedFileTable;
