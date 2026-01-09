import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { WordBreak, StyledRouterLink } from "@evg-ui/lib/components/styles";
import {
  useLeafyGreenTable,
  LGColumnDef,
  BaseTable,
} from "@evg-ui/lib/components/Table";
import { useErrorToast } from "@evg-ui/lib/hooks";
import { getTaskRoute } from "constants/routes";
import {
  ImageGeneralQuery,
  ImageGeneralQueryVariables,
} from "gql/generated/types";
import { IMAGE_GENERAL } from "gql/queries";
import { useDateFormat } from "hooks";

type GeneralInfo = {
  property: string;
  value: React.ReactNode | string;
};

type GeneralTableProps = {
  imageId: string;
};

export const GeneralTable: React.FC<GeneralTableProps> = ({ imageId }) => {
  const {
    data: imageData,
    error,
    loading,
  } = useQuery<ImageGeneralQuery, ImageGeneralQueryVariables>(IMAGE_GENERAL, {
    variables: { imageId },
  });
  useErrorToast(error, "There was an error loading the image general table");

  const getDateCopy = useDateFormat();

  const data = useMemo(() => {
    if (loading) {
      return [];
    }

    const image = imageData?.image;
    return [
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
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageData?.image]);

  const table = useLeafyGreenTable<GeneralInfo>({
    columns,
    data,
    defaultColumn: {
      enableColumnFilter: false,
    },
  });

  return (
    <BaseTable
      data-cy-row="general-table-row"
      loading={loading}
      loadingRows={4}
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
