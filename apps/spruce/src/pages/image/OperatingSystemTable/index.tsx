import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  useLeafyGreenTable,
  LGColumnDef,
  ColumnFiltersState,
  PaginationState,
  BaseTable,
  onChangeHandler,
} from "@evg-ui/lib/components";
import { DEFAULT_PAGE_SIZE } from "@evg-ui/lib/constants";
import { useErrorToast } from "@evg-ui/lib/hooks";
import { useImageAnalytics } from "analytics";
import {
  OsInfo,
  ImageOperatingSystemQuery,
  ImageOperatingSystemQueryVariables,
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
          page: pagination.pageIndex,
          limit: pagination.pageSize,
          name: columnFilters.find((filter) => filter.id === "name")
            ?.value as string,
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
    manualPagination: true,
    manualFiltering: true,
    rowCount: numTotalItems,
    state: {
      pagination,
      columnFilters,
    },
    onColumnFiltersChange: onChangeHandler<ColumnFiltersState>(
      setColumnFilters,
      (f) =>
        sendEvent({
          name: "Filtered table",
          "table.name": "Operating System",
          "table.filters": f,
        }),
    ),
    onPaginationChange: onChangeHandler<PaginationState>(setPagination, (p) =>
      sendEvent({
        name: "Changed table pagination",
        "table.name": "Operating System",
        "table.pagination": p,
      }),
    ),
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
    header: "Name",
    accessorKey: "name",
    enableColumnFilter: true,
    meta: {
      search: {
        "data-cy": "os-name-filter",
        placeholder: "Name regex",
      },
    },
  },
  {
    header: "Version",
    accessorKey: "version",
    cell: ({ getValue }) => (getValue() as string).replace(/"/g, ""),
  },
];
