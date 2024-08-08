import { useRef } from "react";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { useLeafyGreenTable, LGColumnDef } from "@leafygreen-ui/table";
import { fontFamilies } from "@leafygreen-ui/tokens";
import { BaseTable } from "components/Table/BaseTable";
import { ImageEventEntry } from "gql/generated/types";

interface ImageEventDiffTableProps {
  entries: ImageEventEntry[];
}

export const ImageEventDiffTable: React.FC<ImageEventDiffTableProps> = ({
  entries,
}) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<ImageEventEntry>({
    columns,
    containerRef: tableContainerRef,
    data: entries,
    defaultColumn: {
      enableColumnFilter: false,
    },
  });

  return <BaseTable shouldAlternateRowColor table={table} />;
};

const CellText = styled.span`
  font-family: ${fontFamilies.code};
  font-size: 12px;
  line-height: 16px;
  word-break: break-all;
`;

const columns: LGColumnDef<ImageEventEntry>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ getValue }) => <CellText>{getValue() as string}</CellText>,
    enableSorting: true,
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ getValue }) => <CellText>{getValue() as string}</CellText>,
    enableSorting: true,
  },
  {
    header: "Before",
    accessorKey: "before",
    cell: ({ getValue }) => <CellText>{getValue() as string}</CellText>,
  },
  {
    header: "After",
    accessorKey: "after",
    cell: ({ getValue }) =>
      getValue() === null || getValue() === undefined ? (
        <Badge variant={Variant.Red}>Deleted</Badge>
      ) : (
        <CellText>{getValue() as string}</CellText>
      ),
  },
  {
    header: "Action",
    accessorKey: "action",
    cell: ({ getValue }) =>
      getValue() === null || getValue() === undefined ? (
        <Badge variant={Variant.Red}>Deleted</Badge>
      ) : (
        <CellText>{getValue() as string}</CellText>
      ),
  },
];
