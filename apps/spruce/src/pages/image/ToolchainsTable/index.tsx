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
import { useErrorToast } from "@evg-ui/lib/hooks";
import { useImageAnalytics } from "analytics";
import {
  Toolchain,
  ImageToolchainsQuery,
  ImageToolchainsQueryVariables,
} from "gql/generated/types";
import { IMAGE_TOOLCHAINS } from "gql/queries";

type ToolchainsTableProps = {
  imageId: string;
};

export const ToolchainsTable: React.FC<ToolchainsTableProps> = ({
  imageId,
}) => {
  const { sendEvent } = useImageAnalytics();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const {
    data: imageData,
    error,
    loading,
  } = useQuery<ImageToolchainsQuery, ImageToolchainsQueryVariables>(
    IMAGE_TOOLCHAINS,
    {
      variables: {
        imageId,
        opts: {
          page: pagination.pageIndex,
          limit: pagination.pageSize,
          name:
            (columnFilters.find((filter) => filter.id === "name")
              ?.value as string) ?? undefined,
        },
      },
    },
  );
  useErrorToast(error, "There was an error loading image toolchains");

  const toolchains = imageData?.image?.toolchains?.data ?? [];

  const numTotalItems =
    imageData?.image?.toolchains?.filteredCount ??
    imageData?.image?.toolchains?.totalCount;

  const table = useLeafyGreenTable<Toolchain>({
    columns,
    data: toolchains,
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
          "table.name": "Toolchains",
          "table.filters": f,
        }),
    ),
    onPaginationChange: onChangeHandler<PaginationState>(setPagination, (p) =>
      sendEvent({
        name: "Changed table pagination",
        "table.name": "Toolchains",
        "table.pagination": p,
      }),
    ),
    state: {
      pagination,
      columnFilters,
    },
  });

  return (
    <BaseTable
      data-cy-row="toolchains-table-row"
      loading={loading}
      loadingRows={pagination.pageSize}
      numTotalItems={numTotalItems}
      shouldAlternateRowColor
      table={table}
      usePagination
    />
  );
};

const columns: LGColumnDef<Toolchain>[] = [
  {
    header: "Name",
    accessorKey: "name",
    enableColumnFilter: true,
    meta: {
      search: {
        "data-cy": "toolchain-name-filter",
        placeholder: "Name regex",
      },
    },
  },
  {
    header: "Path",
    accessorKey: "path",
  },
  {
    header: "Version",
    accessorKey: "version",
  },
];
