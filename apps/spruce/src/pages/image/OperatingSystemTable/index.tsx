import { useRef, useState } from "react";
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
  const dispatchToast = useToastContext();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { data: osData, loading } = useQuery<
    ImageOperatingSystemQuery,
    ImageOperatingSystemQueryVariables
  >(IMAGE_OPERATING_SYSTEM, {
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
        `There was an error loading operating system information: ${err.message}`,
      );
    },
  });

  const operatingSystemInfo = osData?.image?.operatingSystem.data ?? [];

  const numTotalItems =
    osData?.image?.operatingSystem.filteredCount ??
    osData?.image?.operatingSystem.totalCount;

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<OsInfo>({
    columns,
    data: operatingSystemInfo,
    containerRef: tableContainerRef,
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
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
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
