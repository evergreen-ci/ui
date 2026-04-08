import { useMemo } from "react";
import styled from "@emotion/styled";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { Tooltip, Align, Justify } from "@leafygreen-ui/tooltip";
import { Subtitle } from "@leafygreen-ui/typography";
import { StyledLink } from "@evg-ui/lib/components/styles";
import {
  useLeafyGreenTable,
  LGColumnDef,
  BaseTable,
} from "@evg-ui/lib/components/Table";
import { size } from "@evg-ui/lib/constants/tokens";
import { useTaskAnalytics } from "analytics";
import { processFiles } from "./AssociatedLinks";
import { GroupedFilesFile, FileTableRow } from "./types";

const getColumns = (
  taskAnalytics: ReturnType<typeof useTaskAnalytics>,
): LGColumnDef<FileTableRow>[] => [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
    meta: {
      width: "90%",
    },
    cell: (value) => {
      const { link, name: fileName, urlParsley } = value.row.original;
      return (
        <StyledLink
          data-cy="file-link"
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
              data-cy="parsley-link"
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
];

interface GroupedFileTableProps {
  files: GroupedFilesFile[];
  taskName?: string;
}

const GroupedFileTable: React.FC<GroupedFileTableProps> = ({
  files,
  taskName,
}) => {
  const taskAnalytics = useTaskAnalytics();

  const memoizedColumns = useMemo(
    () => getColumns(taskAnalytics),
    [taskAnalytics],
  );

  const tableData = useMemo(
    () => processFiles(files, taskAnalytics),
    [files, taskAnalytics],
  );

  const table = useLeafyGreenTable<FileTableRow>({
    data: tableData,
    columns: memoizedColumns,
    defaultColumn: {
      enableColumnFilter: false,
    },
    initialState: {
      expanded: true,
    },
  });

  return (
    <Container>
      {taskName && <Subtitle>{taskName}</Subtitle>}
      <BaseTable shouldAlternateRowColor table={table} />
    </Container>
  );
};

const Container = styled.div`
  margin-bottom: ${size.m};
`;

export default GroupedFileTable;
