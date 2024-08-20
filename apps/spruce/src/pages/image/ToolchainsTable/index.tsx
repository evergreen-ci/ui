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
  ImageToolchainsQuery,
  ImageToolchainsQueryVariables,
} from "gql/generated/types";
import { IMAGE_TOOLCHAINS } from "gql/queries";
import { Unpacked } from "types/utils";

type Toolchain = Unpacked<
  NonNullable<ImageToolchainsQuery["image"]>["toolchains"]["data"]
>;

type ToolchainsTableProps = {
  imageId: string;
};

export const ToolchainsTable: React.FC<ToolchainsTableProps> = ({
  imageId,
}) => {
  const dispatchToast = useToastContext();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data: imageData, loading } = useQuery<
    ImageToolchainsQuery,
    ImageToolchainsQueryVariables
  >(IMAGE_TOOLCHAINS, {
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
    onError(err) {
      dispatchToast.error(
        `There was an error loading image toolchains: ${err.message}`,
      );
    },
  });

  const toolchains = useMemo(
    () => imageData?.image?.toolchains?.data ?? [],
    [imageData?.image?.toolchains?.data],
  );

  const numTotalItems =
    imageData?.image?.toolchains?.filteredCount ??
    imageData?.image?.toolchains?.totalCount;

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<Toolchain>({
    columns,
    containerRef: tableContainerRef,
    data: toolchains,
    defaultColumn: {
      enableColumnFilter: false,
    },
    manualFiltering: true,
    manualPagination: true,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
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
