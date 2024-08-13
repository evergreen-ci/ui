import { useMemo, useRef } from "react";
import { useQuery } from "@apollo/client";
import { useLeafyGreenTable, LGColumnDef } from "@leafygreen-ui/table";
import { useParams } from "react-router-dom";
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
  const { data: packagesData } = useQuery<
    ImagePackagesQuery,
    ImagePackagesQueryVariables
  >(IMAGE_PACKAGES, {
    variables: { imageId: selectedImage, opts: {} },
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
  });

  return <BaseTable table={table} shouldAlternateRowColor />;
};
