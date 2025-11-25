import { useState } from "react";
import styled from "@emotion/styled";
import { Badge, Variant } from "@leafygreen-ui/badge";
import { WordBreak } from "@evg-ui/lib/components/styles";
import {
  ColumnFiltersState,
  useLeafyGreenTable,
  LGColumnDef,
  filterFns,
  getFilteredRowModel,
  getFacetedUniqueValues,
  BaseTable,
  onChangeHandler,
} from "@evg-ui/lib/components/Table";
import { size } from "@evg-ui/lib/constants/tokens";
import { useImageAnalytics } from "analytics";
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
    title: "OS",
    value: ImageEventType.OperatingSystem,
    key: ImageEventType.OperatingSystem,
  },
  {
    title: "File",
    value: ImageEventType.File,
    key: ImageEventType.File,
  },
];

const eventTypeToLabel = {
  [ImageEventType.Package]: "Package",
  [ImageEventType.Toolchain]: "Toolchain",
  [ImageEventType.OperatingSystem]: "OS",
  [ImageEventType.File]: "File",
};

interface ImageEventLogTableProps {
  entries: ImageEventEntry[];
  globalFilter: string;
}

export const ImageEventLogTable: React.FC<ImageEventLogTableProps> = ({
  entries,
  globalFilter,
}) => {
  const { sendEvent } = useImageAnalytics();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useLeafyGreenTable<ImageEventEntry>({
    columns,
    data: entries,
    defaultColumn: {
      enableColumnFilter: false,
    },
    onColumnFiltersChange: onChangeHandler<ColumnFiltersState>(
      setColumnFilters,
      (f) =>
        sendEvent({
          name: "Filtered table",
          "table.name": "Image Event Log",
          "table.filters": f,
        }),
    ),
    state: {
      columnFilters,
      globalFilter,
    },
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    enableGlobalFilter: true,
    globalFilterFn: filterFns.includesString,
  });

  const hasFilters = columnFilters.length > 0 || globalFilter;

  const emptyMessage = hasFilters
    ? "No data to display"
    : "No changes detected within the scope. The scope can be expanded upon request to the Runtime Environments team.";

  return (
    <BaseTable
      data-cy-row="image-event-log-table-row"
      emptyComponent={
        <DefaultEmptyMessage data-cy="image-event-log-empty-message">
          {emptyMessage}
        </DefaultEmptyMessage>
      }
      shouldAlternateRowColor
      table={table}
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
      width: "25%",
    },
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ getValue }) => {
      const value = getValue() as ImageEventType;
      return eventTypeToLabel[value];
    },
    enableColumnFilter: true,
    filterFn: filterFns.arrIncludesSome,
    meta: {
      treeSelect: {
        "data-cy": "image-event-log-type-filter",
        filterOptions: true,
        options: imageEventTypeTreeData,
      },
      width: "15%",
    },
  },
  {
    header: "Before",
    accessorKey: "before",
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
  },
  {
    header: "After",
    accessorKey: "after",
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
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
      width: "5%",
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

const DefaultEmptyMessage = styled.div`
  margin-top: ${size.xs};
  margin-left: ${tableColumnOffset};
`;
