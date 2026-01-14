import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { IconButton } from "@leafygreen-ui/icon-button";
import { Tooltip, Align, Justify } from "@leafygreen-ui/tooltip";
import Icon from "@evg-ui/lib/components/Icon";
import { StyledRouterLink, StyledLink } from "@evg-ui/lib/components/styles";
import {
  useLeafyGreenTable,
  LGColumnDef,
  BaseTable,
} from "@evg-ui/lib/components/Table";
import { size } from "@evg-ui/lib/constants/tokens";
import { useErrorToast } from "@evg-ui/lib/hooks";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { amazonEC2InstanceTypeDocumentationUrl } from "constants/externalResources";
import { defaultEC2Region, MCI_USER } from "constants/hosts";
import { getAllHostsRoute, getDistroSettingsRoute } from "constants/routes";
import {
  ImageDistrosQuery,
  ImageDistrosQueryVariables,
  Provider,
} from "gql/generated/types";
import { IMAGE_DISTROS } from "gql/queries";

type Distro = Unpacked<NonNullable<ImageDistrosQuery["image"]>["distros"]>;

type DistrosTableProps = {
  imageId: string;
};

export const DistrosTable: React.FC<DistrosTableProps> = ({ imageId }) => {
  const {
    data: imageData,
    error,
    loading,
  } = useQuery<ImageDistrosQuery, ImageDistrosQueryVariables>(IMAGE_DISTROS, {
    variables: { imageId },
  });
  useErrorToast(error, "There was an error loading image distros");

  const distros = imageData?.image?.distros ?? [];

  const table = useLeafyGreenTable<Distro>({
    columns,
    data: distros,
    defaultColumn: {
      enableColumnFilter: false,
    },
  });

  return (
    <BaseTable
      data-cy-row="distro-table-row"
      loading={loading}
      shouldAlternateRowColor
      table={table}
    />
  );
};

const columns: LGColumnDef<Distro>[] = [
  {
    header: "Name",
    accessorKey: "name",
    size: 200,
    cell: ({ getValue }) => {
      const distro = getValue() as string;
      return (
        <StyledRouterLink to={getDistroSettingsRoute(distro)}>
          {distro}
        </StyledRouterLink>
      );
    },
  },
  {
    header: () => (
      <HeaderCell>
        <span>Instance Type</span>
        <Tooltip
          align={Align.Top}
          justify={Justify.Middle}
          trigger={
            <IconButton aria-label="Information about instance type">
              <Icon
                data-cy="instance-type-information"
                glyph="InfoWithCircle"
              />
            </IconButton>
          }
          triggerEvent="click"
        >
          Amazon instance type definitions can be found{" "}
          <StyledLink
            hideExternalIcon={false}
            href={amazonEC2InstanceTypeDocumentationUrl}
            target="_blank"
          >
            here
          </StyledLink>
          .
        </Tooltip>
      </HeaderCell>
    ),
    accessorKey: "providerSettingsList",
    cell: ({
      row: {
        original: { provider, providerSettingsList },
      },
    }) => (
      <span>
        {provider === Provider.Ec2Fleet || provider === Provider.Ec2OnDemand
          ? providerSettingsList.find((e) => e.region === defaultEC2Region)
              ?.instance_type
          : "N/A"}
      </span>
    ),
  },
  {
    header: "Max Hosts",
    accessorKey: "hostAllocatorSettings.maximumHosts",
    size: 100,
    cell: ({
      getValue,
      row: {
        original: { provider, providerSettingsList },
      },
    }) => (
      <span>
        {provider === Provider.Ec2Fleet || provider === Provider.Ec2OnDemand
          ? getValue()
          : (providerSettingsList?.[0]?.hosts?.length ?? 0)}
      </span>
    ),
  },
  {
    id: "view-hosts-links",
    size: 100,
    cell: ({
      row: {
        original: { name },
      },
    }) => (
      <StyledRouterLink
        to={getAllHostsRoute({ distroId: name, startedBy: MCI_USER })}
      >
        View hosts
      </StyledRouterLink>
    ),
  },
];

const HeaderCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xxs};
`;
