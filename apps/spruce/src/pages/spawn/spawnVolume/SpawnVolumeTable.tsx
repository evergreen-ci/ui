import { useMemo, useRef } from "react";
import styled from "@emotion/styled";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { LeafyGreenTableRow, useLeafyGreenTable } from "@leafygreen-ui/table";
import { formatDistanceToNow } from "date-fns";
import { WordBreak, StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { DoesNotExpire } from "components/Spawn";
import { BaseTable } from "components/Table/BaseTable";
import { getSpawnHostRoute } from "constants/routes";
import { useQueryParam } from "hooks/useQueryParam";
import { MyVolume, QueryParams, TableVolume } from "types/spawn";
import { SpawnVolumeCard } from "./SpawnVolumeCard";
import { SpawnVolumeTableActions } from "./SpawnVolumeTableActions";
import { VolumeStatusBadge } from "./VolumeStatusBadge";

interface SpawnVolumeTableProps {
  volumes: MyVolume[];
}

export const SpawnVolumeTable: React.FC<SpawnVolumeTableProps> = ({
  volumes,
}) => {
  const [selectedVolume] = useQueryParam(QueryParams.Volume, "");

  const dataSource: TableVolume[] = useMemo(() => {
    const volumesCopy = [...volumes];
    volumesCopy.sort(sortByHost);
    return volumes.map((v) => ({
      ...v,
      renderExpandedContent: (row: LeafyGreenTableRow<TableVolume>) => (
        <SpawnVolumeCard volume={row.original} />
      ),
    }));
  }, [volumes]);

  const initialExpanded = Object.fromEntries(
    dataSource.map(({ id }, i) => [i, id === selectedVolume]),
  );

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<TableVolume>({
    columns,
    containerRef: tableContainerRef,
    data: dataSource,
    defaultColumn: {
      enableColumnFilter: false,
      enableSorting: false,
      size: "auto" as unknown as number,
      // Handle bug in sorting order
      // https://github.com/TanStack/table/issues/4289
      sortDescFirst: false,
    },
    initialState: {
      expanded: initialExpanded,
    },
  });

  return <BaseTable shouldAlternateRowColor table={table} />;
};

const getHostDisplayName = (v: TableVolume) =>
  v?.host?.displayName ? v.host.displayName : v.hostID;

const sortByHost = (a: TableVolume, b: TableVolume) =>
  getHostDisplayName(a).localeCompare(getHostDisplayName(b));

const columns = [
  {
    header: "Volume",
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    accessorFn: ({ displayName, id }) => displayName || id,
    enableSorting: true,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    cell: ({ getValue }) => (
      <WordBreak data-cy="vol-name">{getValue()}</WordBreak>
    ),
  },
  {
    header: "Mounted On",
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    accessorFn: ({ host, hostID }) => host?.displayName || hostID,
    enableSorting: true,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    cell: ({ getValue, row }) => {
      const hostId = row.original.hostID;
      return (
        hostId && (
          <StyledRouterLink
            data-cy="host-link"
            to={getSpawnHostRoute({ host: hostId })}
          >
            <WordBreak>{getValue()}</WordBreak>
          </StyledRouterLink>
        )
      );
    },
  },
  {
    header: "Status",
    accessorKey: "hostID",
    enableSorting: true,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    cell: ({ getValue, row }) => {
      const hostId = getValue();
      const { migrating } = row.original;
      return <VolumeStatusBadge hostId={hostId} migrating={migrating} />;
    },
  },
  {
    header: "Expires In",
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    accessorFn: ({ expiration }) => new Date(expiration),
    enableSorting: true,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    cell: ({ getValue, row }) => {
      const expiration = getValue();
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
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    cell: ({ row }) => <SpawnVolumeTableActions volume={row.original} />,
  },
];

const InfoContainer = styled.div`
  position: relative;
  left: ${size.xxs};
`;
