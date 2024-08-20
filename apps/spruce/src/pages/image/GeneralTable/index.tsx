import React, { useMemo, useRef } from "react";
import { useQuery } from "@apollo/client";
import { useLeafyGreenTable, LGColumnDef } from "@leafygreen-ui/table";
import { StyledRouterLink, WordBreak } from "components/styles";
import { BaseTable } from "components/Table/BaseTable";
import { getTaskRoute } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  ImageGeneralQuery,
  ImageGeneralQueryVariables,
} from "gql/generated/types";
import { IMAGE_GENERAL } from "gql/queries";
import { getDateCopy } from "utils/string";

type GeneralInfo = {
  property: string;
  value: React.ReactNode | string;
};

type GeneralTableProps = {
  imageId: string;
};

export const GeneralTable: React.FC<GeneralTableProps> = ({ imageId }) => {
  const dispatchToast = useToastContext();
  const { data: imageData, loading } = useQuery<
    ImageGeneralQuery,
    ImageGeneralQueryVariables
  >(IMAGE_GENERAL, {
    variables: { imageId },
    onError(err) {
      dispatchToast.error(
        `There was an error loading the image general table: ${err.message}`,
      );
    },
  });

  const image = useMemo(() => imageData?.image, [imageData?.image]);

  const tableData = useMemo(
    () => [
      {
        property: "Last deployed",
        value: image?.lastDeployed ? getDateCopy(image.lastDeployed) : "N/A",
      },
      {
        property: "Amazon Machine Image (AMI)",
        value: image?.ami ?? "N/A",
      },
      {
        property: "Latest task",
        value: image?.latestTask?.id ? (
          <StyledRouterLink to={getTaskRoute(image.latestTask.id)}>
            <WordBreak>{image.latestTask.id}</WordBreak>
          </StyledRouterLink>
        ) : (
          "N/A"
        ),
      },
      {
        property: "Latest task time",
        value: image?.latestTask?.finishTime
          ? getDateCopy(image.latestTask.finishTime)
          : "N/A",
      },
    ],
    [image],
  );

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<GeneralInfo>({
    columns: useMemo(() => columns, []),
    data: useMemo(() => tableData, [tableData]),
    containerRef: tableContainerRef,
    defaultColumn: {
      enableColumnFilter: false,
    },
  });

  return (
    <BaseTable
      data-cy-row="general-table-row"
      loading={loading}
      shouldAlternateRowColor
      table={table}
    />
  );
};

const columns: LGColumnDef<GeneralInfo>[] = [
  {
    header: "Property",
    accessorKey: "property",
  },
  {
    header: "Value",
    accessorKey: "value",
    cell: ({ getValue }) => getValue(),
  },
];