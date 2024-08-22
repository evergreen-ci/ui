import { useRef, useState } from "react";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import {
  ColumnFiltersState,
  useLeafyGreenTable,
  LGColumnDef,
  filterFns,
  getFilteredRowModel,
  getFacetedUniqueValues,
} from "@leafygreen-ui/table";
import { toSentenceCase } from "@evg-ui/lib/utils/string";
import { BaseTable } from "components/Table/BaseTable";
import { tableColumnOffset } from "constants/tokens";
import {
  ImageEventEntry,
  ImageEventEntryAction,
  ImageEventType,
} from "gql/generated/types";

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

const imageEventTypeTreeData = [
  {
    title: "Package",
    value: ImageEventType.Package,
    key: ImageEventType.Package,
  },
  {
    title: "Toolchain",
    value: ImageEventType.Toolchain,
    key: ImageEventType.Toolchain,
  },
  {
    title: "Operating System",
    value: ImageEventType.OperatingSystem,
    key: ImageEventType.OperatingSystem,
  },
];

interface ImageEventLogTableProps {
  entries: ImageEventEntry[];
  globalFilter: string;
}

export const ImageEventLogTable: React.FC<ImageEventLogTableProps> = ({
  entries,
  globalFilter,
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
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
      globalFilter,
    },
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    enableGlobalFilter: true,
    globalFilterFn: filterFns.includesString,
  });

  const hasFilters = columnFilters.length > 0;

  const emptyMessage = hasFilters
    ? "No data to display"
    : "No changes detected within the scope. The scope can be expanded upon request from the runtime environments team.";

  return (
    <BaseTable
      data-cy-row="image-event-log-table-row"
      shouldAlternateRowColor
      table={table}
      emptyComponent={
        <DefaultEmptyMessage data-cy="image-event-log-empty-message">
          {emptyMessage}
        </DefaultEmptyMessage>
      }
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
    },
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ getValue }) => {
      const value = getValue() as ImageEventType;
      return toSentenceCase(value);
    },
    enableColumnFilter: true,
    filterFn: filterFns.arrIncludesSome,
    meta: {
      treeSelect: {
        "data-cy": "image-event-log-type-filter",
        filterOptions: true,
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
        filterOptions: true,
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
