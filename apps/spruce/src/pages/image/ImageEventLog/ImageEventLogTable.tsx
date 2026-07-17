import { useState } from "react";
import styled from "@emotion/styled";
import { Badge, Variant } from "@leafygreen-ui/badge";
import { WordBreak } from "@evg-ui/lib/components/styles";
import {
  BaseTable,
  ColumnFiltersState,
  LGColumnDef,
  filterFns,
  getFacetedUniqueValues,
  getFilteredRowModel,
  onChangeHandler,
  useLeafyGreenTable,
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
    key: ImageEventEntryAction.Added,
    title: "ADDED",
    value: ImageEventEntryAction.Added,
  },
  {
    key: ImageEventEntryAction.Updated,
    title: "UPDATED",
    value: ImageEventEntryAction.Updated,
  },
  {
    key: ImageEventEntryAction.Deleted,
    title: "DELETED",
    value: ImageEventEntryAction.Deleted,
  },
];

const imageEventTypeTreeData = [
  {
    key: ImageEventType.Package,
    title: "Package",
    value: ImageEventType.Package,
  },
  {
    key: ImageEventType.Toolchain,
    title: "Toolchain",
    value: ImageEventType.Toolchain,
  },
  {
    key: ImageEventType.OperatingSystem,
    title: "OS",
    value: ImageEventType.OperatingSystem,
  },
  {
    key: ImageEventType.File,
    title: "File",
    value: ImageEventType.File,
  },
];

const eventTypeToLabel = {
  [ImageEventType.File]: "File",
  [ImageEventType.OperatingSystem]: "OS",
  [ImageEventType.Package]: "Package",
  [ImageEventType.Toolchain]: "Toolchain",
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
    enableGlobalFilter: true,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: filterFns.includesString,
    onColumnFiltersChange: onChangeHandler<ColumnFiltersState>(
      setColumnFilters,
      (f) =>
        sendEvent({
          name: "Filtered table",
          "table.filters": f,
          "table.name": "Image Event Log",
        }),
    ),
    state: {
      columnFilters,
      globalFilter,
    },
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
    accessorKey: "name",
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
    enableColumnFilter: true,
    filterFn: filterFns.includesString,
    header: "Name",
    meta: {
      search: {
        "data-cy": "image-event-log-name-filter",
        placeholder: "Search name",
      },
      width: "25%",
    },
  },
  {
    accessorKey: "type",
    cell: ({ getValue }) => {
      const value = getValue() as ImageEventType;
      return eventTypeToLabel[value];
    },
    enableColumnFilter: true,
    filterFn: filterFns.arrIncludesSome,
    header: "Type",
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
    accessorKey: "before",
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
    header: "Before",
  },
  {
    accessorKey: "after",
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
    header: "After",
  },
  {
    accessorKey: "action",
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
    enableColumnFilter: true,
    filterFn: filterFns.arrIncludesSome,
    header: "Action",
    meta: {
      treeSelect: {
        "data-cy": "image-event-log-action-filter",
        filterOptions: true,
        options: imageEventEntryActionTreeData,
      },
      width: "5%",
    },
  },
];

const DefaultEmptyMessage = styled.div`
  margin-top: ${size.xs};
  margin-left: ${tableColumnOffset};
`;
