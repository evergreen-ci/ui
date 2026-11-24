import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { useAppLayout } from "@via-ds/components/app-layout";
import {
  TABLE_DETAILS_PANEL_KEY,
  type TableDetailsRenderProps,
  TableSlot,
  useTableDetails,
} from "@via-ds/components/table";
import { ToggleButton } from "@via-ds/components/toggle-button";
import Note from "@via-ds/icons/Note";
import { formatDistanceToNow } from "date-fns";
import { StyledRouterLink, WordBreak } from "@evg-ui/lib/components/styles";
import {
  ViaBaseTable,
  ViaColumnDef,
  useTable,
} from "@evg-ui/lib/components/Table";
import { size } from "@evg-ui/lib/constants/tokens";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { DetailsPanel, DoesNotExpire } from "components/Spawn";
import { getSpawnHostRoute } from "constants/routes";
import { MyVolume, QueryParams, TableVolume } from "types/spawn";
import { SpawnVolumeCard } from "./SpawnVolumeCard";
import { SpawnVolumeTableActions } from "./SpawnVolumeTableActions";
import { VolumeStatusBadge } from "./VolumeStatusBadge";

interface SpawnVolumeTableProps {
  maxSpawnableLimit: number;
  volumes: MyVolume[];
}

export const SpawnVolumeTable: React.FC<SpawnVolumeTableProps> = ({
  maxSpawnableLimit,
  volumes,
}) => {
  const [selectedVolume] = useQueryParam(QueryParams.Volume, "");
  const { setSelectedBottomPanelKey } = useAppLayout();

  const [initialOpenRowIds] = useState(() =>
    volumes.some(({ id }) => id === selectedVolume) ? [selectedVolume] : [],
  );

  useEffect(() => {
    if (initialOpenRowIds.length) {
      setSelectedBottomPanelKey(TABLE_DETAILS_PANEL_KEY);
    }
  }, [initialOpenRowIds, setSelectedBottomPanelKey]);

  const columns = useMemo(
    () => getColumns(maxSpawnableLimit),
    [maxSpawnableLimit],
  );

  const table = useTable<TableVolume>({
    columns,
    data: volumes,
    defaultColumn: {
      enableColumnFilter: false,
      enableSorting: false,
      // Handle bug in sorting order
      // https://github.com/TanStack/table/issues/4289
      sortDescFirst: false,
    },
    getRowId: ({ id }) => id,
  });

  useTableDetails(table, {
    id: "spawn-volumes",
    defaultOpenRowIds: initialOpenRowIds,
    getRowLabel: ({ original }) => getVolumeName(original),
    render: renderVolumeDetails,
  });

  return (
    <ViaBaseTable
      data-testid="spawn-volume-table"
      shouldAlternateRowColor
      table={table}
    />
  );
};

const renderVolumeDetails = (details: TableDetailsRenderProps<TableVolume>) => (
  <DetailsPanel
    {...details}
    getName={getVolumeName}
    noun="volume"
    renderRow={(volume) => <SpawnVolumeCard volume={volume} />}
  />
);

const getVolumeName = ({ displayName, id }: TableVolume) => displayName || id;

const getColumns = (maxSpawnableLimit: number): ViaColumnDef<TableVolume>[] => [
  {
    header: "Volume",
    accessorFn: getVolumeName,
    enableSorting: true,
    cell: ({ getValue }) => (
      <WordBreak data-testid="vol-name">{getValue() as string}</WordBreak>
    ),
  },
  {
    header: "Mounted On",
    accessorFn: ({ host }) => host?.displayName || host?.id,
    enableSorting: true,
    cell: ({ getValue, row }) => {
      const hostId = row.original.host?.id;
      return (
        hostId && (
          <StyledRouterLink
            data-testid="host-link"
            to={getSpawnHostRoute({ host: hostId })}
          >
            <WordBreak>{getValue() as string}</WordBreak>
          </StyledRouterLink>
        )
      );
    },
  },
  {
    header: "Status",
    accessorKey: "host.id",
    enableSorting: true,
    cell: ({ getValue, row }) => {
      const hostId = getValue() as string;
      const { migrating } = row.original;
      return <VolumeStatusBadge hostId={hostId} migrating={migrating} />;
    },
  },
  {
    header: "Expires In",
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    accessorFn: ({ expiration }) => new Date(expiration),
    enableSorting: true,
    cell: ({ getValue, row }) => {
      const expiration = getValue() as Date;
      const { noExpiration } = row.original;
      const isUnexpirable = noExpiration || !expiration;
      return (
        <>
          {isUnexpirable ? DoesNotExpire : formatDistanceToNow(expiration)}
          {!isUnexpirable && row.original.host && (
            <InfoContainer>
              <InfoSprinkle>
                Expiration is not applicable to mounted volumes.
              </InfoSprinkle>
            </InfoContainer>
          )}
        </>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => (
      <SpawnVolumeTableActions
        maxSpawnableLimit={maxSpawnableLimit}
        volume={row.original}
      />
    ),
  },
  {
    id: "details",
    header: "Details",
    cell: () => (
      <ToggleButton slot={TableSlot.PanelToggle}>
        <Note slot="icon" />
      </ToggleButton>
    ),
  },
];

const InfoContainer = styled.div`
  position: relative;
  left: ${size.xxs};
`;
