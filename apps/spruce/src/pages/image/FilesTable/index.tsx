import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { WordBreak } from "@evg-ui/lib/components/styles";
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
  ImageFile,
  ImageFilesQuery,
  ImageFilesQueryVariables,
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
        limit: pagination.pageSize,
        name:
          (columnFilters.find((filter) => filter.id === "name")
            ?.value as string) ?? undefined,
        page: pagination.pageIndex,
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
          "table.filters": f,
          "table.name": "Files",
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
      columnFilters,
      pagination,
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
    accessorKey: "name",
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
    enableColumnFilter: true,
    header: "Name",
    meta: {
      search: {
        "data-cy": "file-name-filter",
        placeholder: "Name regex",
      },
    },
  },
  {
    accessorKey: "path",
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
    header: "Path",
  },
  {
    accessorKey: "version",
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
    header: "File SHA",
  },
];
