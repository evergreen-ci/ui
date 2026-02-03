import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  WordBreak,
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
  ImageFilesQuery,
  ImageFilesQueryVariables,
  ImageFile,
} from "gql/generated/types";
import { IMAGE_FILES } from "gql/queries";

type FilesTableProps = {
  imageId: string;
};

export const FilesTable: React.FC<FilesTableProps> = ({ imageId }) => {
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
  } = useQuery<ImageFilesQuery, ImageFilesQueryVariables>(IMAGE_FILES, {
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
  });
  useErrorToast(error, "There was an error loading image files");

  const files = imageData?.image?.files?.data ?? [];

  const numTotalItems =
    imageData?.image?.files?.filteredCount ??
    imageData?.image?.files?.totalCount;

  const table = useLeafyGreenTable<ImageFile>({
    columns,
    data: files,
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
          "table.name": "Files",
          "table.filters": f,
        }),
    ),
    onPaginationChange: onChangeHandler<PaginationState>(setPagination, (p) =>
      sendEvent({
        name: "Changed table pagination",
        "table.name": "Files",
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
      data-cy-row="files-table-row"
      loading={loading}
      loadingRows={pagination.pageSize}
      numTotalItems={numTotalItems}
      shouldAlternateRowColor
      table={table}
      usePagination
    />
  );
};

const columns: LGColumnDef<ImageFile>[] = [
  {
    header: "Name",
    accessorKey: "name",
    enableColumnFilter: true,
    meta: {
      search: {
        "data-cy": "file-name-filter",
        placeholder: "Name regex",
      },
    },
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
  },
  {
    header: "Path",
    accessorKey: "path",
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
  },
  {
    header: "File SHA",
    accessorKey: "version",
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
  },
];
