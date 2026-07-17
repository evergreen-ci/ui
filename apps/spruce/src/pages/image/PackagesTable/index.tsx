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
  ImagePackagesQuery,
  ImagePackagesQueryVariables,
  Package,
} from "gql/generated/types";
import { IMAGE_PACKAGES } from "gql/queries";

type PackagesTableProps = {
  imageId: string;
};

export const PackagesTable: React.FC<PackagesTableProps> = ({ imageId }) => {
  const { sendEvent } = useImageAnalytics();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const {
    data: packagesData,
    error,
    loading,
  } = useQuery<ImagePackagesQuery, ImagePackagesQueryVariables>(
    IMAGE_PACKAGES,
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
  useErrorToast(error, "There was an error loading image packages");

  const packages = packagesData?.image?.packages.data ?? [];

  const numPackages =
    packagesData?.image?.packages.filteredCount ??
    packagesData?.image?.packages.totalCount;

  const table = useLeafyGreenTable<Package>({
    columns,
    data: packages,
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
          "table.name": "Packages",
        }),
    ),
    onPaginationChange: onChangeHandler<PaginationState>(setPagination, (p) =>
      sendEvent({
        name: "Changed table pagination",
        "table.name": "Packages",
        "table.pagination": p,
      }),
    ),
    rowCount: numPackages,
    state: {
      columnFilters,
      pagination,
    },
  });

  return (
    <BaseTable
      data-cy-row="packages-table-row"
      loading={loading}
      loadingRows={pagination.pageSize}
      numTotalItems={numPackages}
      shouldAlternateRowColor
      table={table}
      usePagination
    />
  );
};

const columns: LGColumnDef<Package>[] = [
  {
    accessorKey: "name",
    enableColumnFilter: true,
    header: "Name",
    meta: {
      search: {
        "data-cy": "package-name-filter",
        placeholder: "Name regex",
      },
    },
  },
  {
    accessorKey: "manager",
    header: "Manager",
  },
  {
    accessorKey: "version",
    header: "Version",
  },
];
