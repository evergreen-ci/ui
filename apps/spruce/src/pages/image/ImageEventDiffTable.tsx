import { useRef, useState } from "react";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import {
  useLeafyGreenTable,
  LGColumnDef,
  filterFns,
  getFilteredRowModel,
} from "@leafygreen-ui/table";
import { BaseTable } from "components/Table/BaseTable";
import { TreeDataEntry } from "components/TreeSelect";
import { ImageEventEntry, ImageEventEntryAction } from "gql/generated/types";

export enum ImageEventTypeV2 {
  Package = "Packages",
  Toolchain = "Toolchains",
}

export const imageEventEntryActionTreeData = [
  {
    title: "ADDED",
    value: ImageEventEntryAction.Added,
    key: ImageEventEntryAction.Added,
  },
  {
    title: "UPDATED",
    value: ImageEventEntryAction.Updated,
    key: ImageEventEntryAction.Updated,
  },
  {
    title: "DELETED",
    value: ImageEventEntryAction.Deleted,
    key: ImageEventEntryAction.Deleted,
  },
];

export const imageEventTypeToCopy = {
  [ImageEventTypeV2.Package]: "Package",
  [ImageEventTypeV2.Toolchain]: "Toolchain",
};

export const imageEventTypeTreeData: TreeDataEntry[] = Object.entries(
  imageEventTypeToCopy,
).map(([key, value]) => ({
  title: value,
  value: key,
  key,
}));

export const ImageEventEntryActionToCopy = {
  [ImageEventEntryAction.Added]: "ADDED",
  [ImageEventEntryAction.Updated]: "UPDATED",
  [ImageEventEntryAction.Deleted]: "DELETED",
};

interface ImageEventDiffTableProps {
  entries: ImageEventEntry[];
}

export const ImageEventDiffTable: React.FC<ImageEventDiffTableProps> = ({
  entries,
}) => {
  const [columnFilters, setColumnFilters] = useState([]);
  console.log("column filters");
  console.log(columnFilters);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<ImageEventEntry>({
    columns,
    containerRef: tableContainerRef,
    data: entries,
    defaultColumn: {
      enableColumnFilter: false,
    },
    // @ts-expect-error
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
    getFilteredRowModel: getFilteredRowModel(),
  });

  return <BaseTable shouldAlternateRowColor table={table} />;
};

const CellText = styled.span`
  font-size: 13px;
`;

const columns: LGColumnDef<ImageEventEntry>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ getValue }) => getValue() as string,
    enableColumnFilter: true,
    filterFn: filterFns.includesString,
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ getValue }) => {
      const value = getValue() as ImageEventTypeV2;
      console.log(value);
      return imageEventTypeToCopy[value] ?? value;
    },
    enableColumnFilter: true,
    filterFn: filterFns.arrIncludesSome,
    meta: {
      treeSelect: {
        filterOptions: false,
        options: imageEventTypeTreeData,
      },
    },
  },
  {
    header: "Before",
    accessorKey: "before",
    cell: ({ getValue }) => <CellText>{getValue() as string}</CellText>,
  },
  {
    header: "After",
    accessorKey: "after",
    cell: ({ getValue }) => <CellText>{getValue() as string}</CellText>,
  },
  {
    header: "Action",
    accessorKey: "action",
    enableColumnFilter: true,
    filterFn: filterFns.arrIncludesSome,
    meta: {
      treeSelect: {
        filterOptions: false,
        options: imageEventEntryActionTreeData,
      },
    },
    cell: ({ getValue }) => {
      const value = getValue() as ImageEventEntryAction;
      if (value === ImageEventEntryAction.Updated) {
        return <Badge variant={Variant.Yellow}>{value}</Badge>;
      }
      if (value === ImageEventEntryAction.Deleted) {
        return <Badge variant={Variant.Red}>{value}</Badge>;
      }
      if (value === ImageEventEntryAction.Added) {
        return <Badge variant={Variant.Green}>{value}</Badge>;
      }
    },
  },
];
