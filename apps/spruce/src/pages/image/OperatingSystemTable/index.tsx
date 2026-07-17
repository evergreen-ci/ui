import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  BaseTable,
  ColumnFiltersState,
  LGColumnDef,
  onChangeHandler,
  PaginationState,
  useLeafyGreenTable,
} from "@evg-ui/lib/components/Table";
import { DEFAULT_PAGE_SIZE } from "@evg-ui/lib/constants/pagination";
import { useErrorToast } from "@evg-ui/lib/hooks";
import { useImageAnalytics } from "analytics";
import {
  ImageOperatingSystemQuery,
  ImageOperatingSystemQueryVariables,
  OsInfo,
} from "gql/generated/types";
import { IMAGE_OPERATING_SYSTEM } from "gql/queries";

type OperatingSystemTableProps = {
  imageId: string;
};

export const OperatingSystemTable: React.FC<OperatingSystemTableProps> = ({
  imageId,
}) => {
  const { sendEvent } = useImageAnalytics();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const {
    data: osData,
    error,
    loading,
  } = useQuery<ImageOperatingSystemQuery, ImageOperatingSystemQueryVariables>(
    IMAGE_OPERATING_SYSTEM,
    {
      variables: {
        imageId,
        opts: {
          limit: pagination.pageSize,
          name: columnFilters.find((filter) => filter.id === "name")
            ?.value as string,
          page: pagination.pageIndex,
        },
      },
    },
  );
  useErrorToast(
    error,
    "There was an error loading operating system information",
  );

  const operatingSystemInfo = osData?.image?.operatingSystem.data ?? [];

  const numTotalItems =
    osData?.image?.operatingSystem.filteredCount ??
    osData?.image?.operatingSystem.totalCount;

  const table = useLeafyGreenTable<OsInfo>({
    columns,
    data: operatingSystemInfo,
    defaultColumn: {
      enableColumnFilter: false,
    },
    manualFiltering: true,
    manualPagination: true,
    onColumnFiltersChange: onChangeHandler<ColumnFiltersState>(
      setColumnFilters,
      (f) =>
        sendEvent({
          name: "Filtered table",
          "table.filters": f,
          "table.name": "Operating System",
        }),
    ),
    onPaginationChange: onChangeHandler<PaginationState>(setPagination, (p) =>
      sendEvent({
        name: "Changed table pagination",
        "table.name": "Operating System",
        "table.pagination": p,
      }),
    ),
    rowCount: numTotalItems,
    state: {
      columnFilters,
      pagination,
    },
  });

  return (
    <BaseTable
      data-cy-row="os-table-row"
      loading={loading}
      loadingRows={pagination.pageSize}
      numTotalItems={numTotalItems}
      shouldAlternateRowColor
      table={table}
      usePagination
    />
  );
};

const columns: LGColumnDef<OsInfo>[] = [
  {
    accessorKey: "name",
    enableColumnFilter: true,
    header: "Name",
    meta: {
      search: {
        "data-cy": "os-name-filter",
        placeholder: "Name regex",
      },
    },
  },
  {
    accessorKey: "version",
    cell: ({ getValue }) => (getValue() as string).replace(/"/g, ""),
    header: "Version",
  },
];
