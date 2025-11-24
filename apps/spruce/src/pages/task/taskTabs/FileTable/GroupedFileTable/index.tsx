import { useMemo } from "react";
import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import { Tooltip } from "@leafygreen-ui/tooltip";
import { Subtitle } from "@leafygreen-ui/typography";
import { StyledLink } from "@evg-ui/lib/components/styles";
import {
  useLeafyGreenTable,
  LGColumnDef,
  BaseTable,
} from "@evg-ui/lib/components/Table";
import { size } from "@evg-ui/lib/constants/tokens";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { useTaskAnalytics } from "analytics";
import { useConditionallyLinkToParsleyBeta } from "hooks/useConditionallyLinkToParsleyBeta";
import { GroupedFiles } from "../types";

type GroupedFilesFile = Unpacked<NonNullable<GroupedFiles["files"]>>;

const getColumns = (
  taskAnalytics: ReturnType<typeof useTaskAnalytics>,
  replaceUrl: (url: string) => string,
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
                href={
                  value.row.original.urlParsley
                    ? replaceUrl(value.row.original.urlParsley)
                    : undefined
                }
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
  const taskAnalytics = useTaskAnalytics();
  const { replaceUrl } = useConditionallyLinkToParsleyBeta();

  const memoizedColumns = useMemo(
    () => getColumns(taskAnalytics, replaceUrl),
    [taskAnalytics, replaceUrl],
  );

  const table = useLeafyGreenTable<GroupedFilesFile>({
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
