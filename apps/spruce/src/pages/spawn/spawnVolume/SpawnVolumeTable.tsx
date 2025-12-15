import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { formatDistanceToNow } from "date-fns";
import { WordBreak, StyledRouterLink } from "@evg-ui/lib/components/styles";
import {
  ExpandedState,
  LeafyGreenTableRow,
  useLeafyGreenTable,
  BaseTable,
  LGColumnDef,
} from "@evg-ui/lib/components/Table";
import { size } from "@evg-ui/lib/constants/tokens";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { DoesNotExpire } from "components/Spawn";
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

  const volumeData: TableVolume[] = useMemo(() => {
    const volumesCopy = [...volumes];
    volumesCopy.sort(sortByHost);
    return volumes.map((v) => ({
      ...v,
      renderExpandedContent,
    }));
  }, [volumes]);

  const initialExpanded = Object.fromEntries(
    volumeData.map(({ id }, i) => [i, id === selectedVolume]),
  );

  // Remove and use initialState instead when LG-5035 is complete.
  const [expanded, setExpanded] = useState<ExpandedState>(initialExpanded);

  const columns = useMemo(
    () => getColumns(maxSpawnableLimit),
    [maxSpawnableLimit],
  );

  const table = useLeafyGreenTable<TableVolume>({
    columns,
    data: volumeData,
    defaultColumn: {
      enableColumnFilter: false,
      enableSorting: false,
      size: "auto" as unknown as number,
      // Handle bug in sorting order
      // https://github.com/TanStack/table/issues/4289
      sortDescFirst: false,
    },
    onExpandedChange: setExpanded,
    state: {
      expanded,
    },
  });

  return <BaseTable shouldAlternateRowColor table={table} />;
};

const renderExpandedContent = (row: LeafyGreenTableRow<TableVolume>) => (
  <SpawnVolumeCard volume={row.original} />
);

const getHostDisplayName = (v: TableVolume) =>
  v?.host?.displayName ? v.host.displayName : v.hostID;

const sortByHost = (a: TableVolume, b: TableVolume) =>
  getHostDisplayName(a).localeCompare(getHostDisplayName(b));

const getColumns = (maxSpawnableLimit: number): LGColumnDef<TableVolume>[] => [
  {
    header: "Volume",
    accessorFn: ({ displayName, id }) => displayName || id,
    enableSorting: true,
    cell: ({ getValue }) => (
      <WordBreak data-cy="vol-name">{getValue() as string}</WordBreak>
    ),
  },
  {
    header: "Mounted On",
    accessorFn: ({ host, hostID }) => host?.displayName || hostID,
    enableSorting: true,
    cell: ({ getValue, row }) => {
      const hostId = row.original.hostID;
      return (
        hostId && (
          <StyledRouterLink
            data-cy="host-link"
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
    accessorKey: "hostID",
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
          {!isUnexpirable && row.original.hostID && (
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
];

const InfoContainer = styled.div`
  position: relative;
  left: ${size.xxs};
`;
