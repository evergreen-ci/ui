import { useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useLeafyGreenTable, LGColumnDef } from "@leafygreen-ui/table";
import { useParams } from "react-router-dom";
import PageSizeSelector from "components/PageSizeSelector";
import Pagination from "components/Pagination";
import { SettingsCard } from "components/SettingsCard";
import { BaseTable } from "components/Table/BaseTable";
import { slugs } from "constants/routes";
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
  const { data: packagesData } = useQuery<
    ImagePackagesQuery,
    ImagePackagesQueryVariables
  >(IMAGE_PACKAGES, {
    variables: {
      imageId: selectedImage,
      opts: { page: pagination.pageIndex, limit: pagination.pageSize },
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
    rowCount: totalNumPackages,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  return (
    <SettingsCard>
      <BaseTable table={table} shouldAlternateRowColor />
      <PaginationWrapper>
        <PageSizeSelector
          value={pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(e);
          }}
        />
        <Pagination
          currentPage={pagination.pageIndex}
          totalResults={totalNumPackages}
          pageSize={pagination.pageSize}
        />
      </PaginationWrapper>
    </SettingsCard>
  );
};

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
`;
