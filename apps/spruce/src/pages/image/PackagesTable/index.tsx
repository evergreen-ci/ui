import { useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  useLeafyGreenTable,
  LGColumnDef,
  ColumnFiltersState,
  PaginationState,
} from "@leafygreen-ui/table";
import { BaseTable } from "components/Table/BaseTable";
import { DEFAULT_PAGE_SIZE } from "constants/index";
import { useToastContext } from "context/toast";
import {
  Package,
  ImagePackagesQuery,
  ImagePackagesQueryVariables,
} from "gql/generated/types";
import { IMAGE_PACKAGES } from "gql/queries";

type PackagesTableProps = {
  imageId: string;
};

export const PackagesTable: React.FC<PackagesTableProps> = ({ imageId }) => {
  const dispatchToast = useToastContext();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { data: packagesData, loading } = useQuery<
    ImagePackagesQuery,
    ImagePackagesQueryVariables
  >(IMAGE_PACKAGES, {
    variables: {
      imageId,
      opts: {
        page: pagination.pageIndex,
        limit: pagination.pageSize,
        name: columnFilters.find((filter) => filter.id === "name")
          ?.value as string,
      },
    },
    onError(err) {
      dispatchToast.error(
        `There was an error loading image packages: ${err.message}`,
      );
    },
  });

  const packages = useMemo(
    () => packagesData?.image?.packages.data ?? [],
    [packagesData?.image?.packages.data],
  );

  const numPackages = useMemo(
    () =>
      packagesData?.image?.packages.filteredCount ??
      packagesData?.image?.packages.totalCount,
    [
      packagesData?.image?.packages.filteredCount,
      packagesData?.image?.packages.totalCount,
    ],
  );

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<Package>({
    columns,
    data: packages,
    containerRef: tableContainerRef,
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
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
  });

  return (
    <BaseTable
      data-cy-row="packages-table-row"
      table={table}
      shouldAlternateRowColor
      loading={loading}
      loadingRows={pagination.pageSize}
      usePagination
      numTotalItems={numPackages}
    />
  );
};

const columns: LGColumnDef<Package>[] = [
  {
    header: "Name",
    accessorKey: "name",
    enableColumnFilter: true,
    filterFn: "includesString",
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
