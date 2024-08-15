import { useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Pagination from "@leafygreen-ui/pagination";
import {
  useLeafyGreenTable,
  LGColumnDef,
  ColumnFiltersState,
} from "@leafygreen-ui/table";
import { useParams } from "react-router-dom";
import { SettingsCard, SettingsCardTitle } from "components/SettingsCard";
import { BaseTable } from "components/Table/BaseTable";
import { slugs } from "constants/routes";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  Package,
  ImagePackagesQuery,
  ImagePackagesQueryVariables,
} from "gql/generated/types";
import { IMAGE_PACKAGES } from "gql/queries";
import { useFirstImage } from "hooks";

export const PackagesTable: React.FC = () => {
  const { [slugs.imageId]: imageId } = useParams();
  const { image: firstImage } = useFirstImage();
  const selectedImage = imageId ?? firstImage;
  const dispatchToast = useToastContext();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { data: packagesData } = useQuery<
    ImagePackagesQuery,
    ImagePackagesQueryVariables
  >(IMAGE_PACKAGES, {
    variables: {
      imageId: selectedImage,
      opts: {
        page: pagination.pageIndex,
        limit: pagination.pageSize,
        // @ts-expect-error
        name: columnFilters.find((filter) => filter.id === "name")?.value,
      },
    },
    onError(err) {
      dispatchToast.error(
        `There was an error loading image packages: ${err.message}`,
      );
    },
  });

  const packageEntries = useMemo(
    () => packagesData?.image?.packages.data ?? [],
    [packagesData?.image?.packages.data],
  );

  const totalNumPackages = useMemo(
    () => packagesData?.image?.packages.totalCount ?? 0,
    [packagesData?.image?.packages.totalCount],
  );

  const columns: LGColumnDef<Package>[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ getValue }) => <span>{getValue() as string}</span>,
      enableColumnFilter: true,
      filterFn: "includesString",
    },
    {
      header: "Manager",
      accessorKey: "manager",
      cell: ({ getValue }) => <span>{getValue() as string}</span>,
    },
    {
      header: "Version",
      accessorKey: "version",
      cell: ({ getValue }) => <span>{getValue() as string}</span>,
    },
  ];

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<Package>({
    columns,
    data: packageEntries,
    containerRef: tableContainerRef,
    defaultColumn: {
      enableColumnFilter: false,
    },
    manualPagination: true,
    manualFiltering: true,
    rowCount: totalNumPackages,
    state: {
      pagination,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
  });

  return (
    <>
      <SettingsCardTitle>Packages</SettingsCardTitle>
      <SettingsCard>
        <BaseTable table={table} shouldAlternateRowColor />
        <PaginationWrapper>
          <Pagination
            itemsPerPage={table.getState().pagination.pageSize}
            onItemsPerPageOptionChange={(value: string) => {
              table.setPageSize(Number(value));
            }}
            numTotalItems={totalNumPackages}
            currentPage={table.getState().pagination.pageIndex + 1}
            onCurrentPageOptionChange={(value: string) => {
              table.setPageIndex(Number(value) - 1);
            }}
            onBackArrowClick={() => table.previousPage()}
            onForwardArrowClick={() => table.nextPage()}
          />
        </PaginationWrapper>
      </SettingsCard>
    </>
  );
};

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${size.xs};
`;
