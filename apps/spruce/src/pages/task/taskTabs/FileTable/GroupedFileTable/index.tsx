import { useMemo, useRef } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { useLeafyGreenTable, LGColumnDef } from "@leafygreen-ui/table";
import Tooltip from "@leafygreen-ui/tooltip";
import { Subtitle } from "@leafygreen-ui/typography";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { useTaskAnalytics } from "analytics";
import { BaseTable } from "components/Table/BaseTable";
import { GroupedFiles } from "../types";

type GroupedFilesFile = Unpacked<GroupedFiles["files"]>;

const columns = (
  taskAnalytics: ReturnType<typeof useTaskAnalytics>,
): LGColumnDef<GroupedFilesFile>[] => [
  {
    accessorKey: "name",
    header: "Name",
    size: 100,
    enableSorting: true,
    cell: (value) => {
      const fileName = value.getValue() as GroupedFilesFile["name"];
      return (
        <CellContainer>
          <StyledLink
            data-cy="file-link"
            href={value.row.original.link}
            onClick={() => {
              taskAnalytics.sendEvent({
                name: "Clicked task file link",
                "parsley.is_available": value.row.original.urlParsley !== null,
                "file.name": fileName,
              });
            }}
          >
            {fileName}
          </StyledLink>
          <Tooltip
            align="top"
            enabled={value.row.original.urlParsley === null}
            justify="middle"
            trigger={
              <Button
                data-cy="parsley-link"
                disabled={value.row.original.urlParsley === null}
                href={value.row.original.urlParsley}
                onClick={() => {
                  taskAnalytics.sendEvent({
                    name: "Clicked task file Parsley link",
                    "file.name": fileName,
                  });
                }}
                size="small"
              >
                Parsley
              </Button>
            }
          >
            Only plain text files can be opened in Parsley.
          </Tooltip>
        </CellContainer>
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
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const taskAnalytics = useTaskAnalytics();

  const memoizedColumns = useMemo(
    () => columns(taskAnalytics),
    [taskAnalytics],
  );

  const table = useLeafyGreenTable<GroupedFilesFile>({
    containerRef: tableContainerRef,
    data: files,
    columns: memoizedColumns,
    defaultColumn: {
      enableColumnFilter: false,
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

const CellContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
export default GroupedFileTable;
