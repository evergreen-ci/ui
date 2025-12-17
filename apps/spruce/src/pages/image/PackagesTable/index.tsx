import { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  useLeafyGreenTable,
  LGColumnDef,
  ColumnFiltersState,
  PaginationState,
  BaseTable,
  onChangeHandler,
} from "@evg-ui/lib/components/Table";
import { DEFAULT_PAGE_SIZE } from "@evg-ui/lib/constants/pagination";
import { useImageAnalytics } from "analytics";
import {
  Package,
  ImagePackagesQuery,
  ImagePackagesQueryVariables,
} from "gql/generated/types";
import { IMAGE_PACKAGES } from "gql/queries";
import { useErrorToast } from "hooks";

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
          page: pagination.pageIndex,
          limit: pagination.pageSize,
          name: columnFilters.find((filter) => filter.id === "name")
            ?.value as string,
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
    manualPagination: true,
    manualFiltering: true,
    rowCount: numPackages,
    state: {
      pagination,
      columnFilters,
    },
    onColumnFiltersChange: onChangeHandler<ColumnFiltersState>(
      setColumnFilters,
      (f) =>
        sendEvent({
          name: "Filtered table",
          "table.name": "Packages",
          "table.filters": f,
        }),
    ),
    onPaginationChange: onChangeHandler<PaginationState>(setPagination, (p) =>
      sendEvent({
        name: "Changed table pagination",
        "table.name": "Packages",
        "table.pagination": p,
      }),
    ),
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
    header: "Name",
    accessorKey: "name",
    enableColumnFilter: true,
    meta: {
      search: {
        "data-cy": "package-name-filter",
        placeholder: "Name regex",
      },
    },
  },
  {
    header: "Manager",
    accessorKey: "manager",
  },
  {
    header: "Version",
    accessorKey: "version",
  },
];
