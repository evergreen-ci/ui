import { useRef, useState } from "react";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import {
  ColumnFiltersState,
  useLeafyGreenTable,
  LGColumnDef,
  filterFns,
  getFilteredRowModel,
} from "@leafygreen-ui/table";
import { BaseTable } from "components/Table/BaseTable";
import { onChangeHandler } from "components/Table/utils";
import { TreeDataEntry } from "components/TreeSelect";
import { tableColumnOffset } from "constants/tokens";
import { ImageEventEntry, ImageEventEntryAction } from "gql/generated/types";

const imageEventEntryActionTreeData = [
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

enum ImageEventTypeV2 {
  Package = "Packages",
  Toolchain = "Toolchains",
}

const imageEventTypeToCopy = {
  [ImageEventTypeV2.Package]: "Package",
  [ImageEventTypeV2.Toolchain]: "Toolchain",
};

const imageEventTypeTreeData: TreeDataEntry[] = Object.entries(
  imageEventTypeToCopy,
).map(([key, value]) => ({
  title: value,
  value: key,
  key,
}));

interface ImageEventLogTableProps {
  entries: ImageEventEntry[];
}

export const ImageEventLogTable: React.FC<ImageEventLogTableProps> = ({
  entries,
}) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<ImageEventEntry>({
    columns,
    containerRef: tableContainerRef,
    data: entries,
    defaultColumn: {
      enableColumnFilter: false,
    },
    onColumnFiltersChange:
      onChangeHandler<ColumnFiltersState>(setColumnFilters),
    state: {
      columnFilters,
    },
    getFilteredRowModel: getFilteredRowModel(),
  });

  const hasFilters = columnFilters.length > 0;

  const emptyMessage = hasFilters
    ? "No data to display"
    : "No changes detected within the scope. The scope can be expanded upon request from the runtime environments team.";

  const emptyComponent = (
    <DefaultEmptyMessage data-cy="image-event-log-empty-message">
      {emptyMessage}
    </DefaultEmptyMessage>
  );

  return (
    <BaseTable
      data-cy-row="image-event-log-table-row"
      shouldAlternateRowColor
      table={table}
      emptyComponent={emptyComponent}
    />
  );
};

const columns: LGColumnDef<ImageEventEntry>[] = [
  {
    header: "Name",
    accessorKey: "name",
    enableColumnFilter: true,
    filterFn: filterFns.includesString,
    meta: {
      search: {
        "data-cy": "image-event-log-name-filter",
        placeholder: "Search name",
      },
      width: "15%",
    },
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ getValue }) => {
      const value = getValue() as ImageEventTypeV2;
      return imageEventTypeToCopy[value] ?? value;
    },
    enableColumnFilter: true,
    filterFn: filterFns.arrIncludesSome,
    meta: {
      treeSelect: {
        "data-cy": "image-event-log-type-filter",
        filterOptions: false,
        options: imageEventTypeTreeData,
      },
    },
  },
  {
    header: "Before",
    accessorKey: "before",
  },
  {
    header: "After",
    accessorKey: "after",
  },
  {
    header: "Action",
    accessorKey: "action",
    enableColumnFilter: true,
    filterFn: filterFns.arrIncludesSome,
    meta: {
      treeSelect: {
        "data-cy": "image-event-log-action-filter",
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

const DefaultEmptyMessage = styled.span`
  margin-left: ${tableColumnOffset};
`;
